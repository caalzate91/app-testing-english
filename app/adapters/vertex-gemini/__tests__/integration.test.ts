/**
 * Integration tests for the Vertex AI adapter
 * Tests the complete workflow from loading JSON to generating Q&A responses
 */

import { VertexGeminiClient } from '../VertexGeminiClient';
import { JsonRepository } from '../JsonRepository';

// Mock the Google Generative AI SDK
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue({
            response: {
              text: jest.fn().mockReturnValue(
                'A listener is someone who enjoys listening to others and pays attention to what they say.'
              ),
            },
          }),
        }),
      };
    }),
  };
});

describe('Vertex AI Adapter Integration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.GEMINI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('End-to-End Q&A Workflow', () => {
    it('should load lessons, convert to context docs, and generate Q&A', async () => {
      // Step 1: Load a lesson
      const lesson = await JsonRepository.loadLesson(1);
      expect(lesson).toBeDefined();
      expect(lesson.questions.length).toBeGreaterThan(0);

      // Step 2: Convert to context documents
      const contextDocs = JsonRepository.lessonToContextDocuments(lesson);
      expect(contextDocs.length).toBe(lesson.questions.length);

      // Step 3: Initialize client
      const client = new VertexGeminiClient();
      expect(client.isConfigured()).toBe(true);

      // Step 4: Generate Q&A response
      const response = await client.qaFromJson(
        contextDocs,
        'What do you call someone who really enjoys listening to others?'
      );

      // Verify response structure
      expect(response).toBeDefined();
      expect(response.answer).toBeDefined();
      expect(typeof response.answer).toBe('string');
      expect(response.answer.length).toBeGreaterThan(0);
      expect(response.sources).toBeDefined();
      expect(Array.isArray(response.sources)).toBe(true);
      expect(response.sources.length).toBeGreaterThan(0);
    });

    it('should work with multiple lessons', async () => {
      // Load multiple lessons
      const lesson1 = await JsonRepository.loadLesson(1);
      const lesson2 = await JsonRepository.loadLesson(2);
      const lessons = [lesson1, lesson2];

      // Convert to context documents
      const contextDocs = JsonRepository.lessonsToContextDocuments(lessons);
      expect(contextDocs.length).toBeGreaterThan(0);

      // Generate Q&A
      const client = new VertexGeminiClient();
      const response = await client.qaFromJson(
        contextDocs,
        'Tell me about making friends and interests'
      );

      expect(response.answer).toBeDefined();
      expect(response.sources.length).toBeGreaterThanOrEqual(1);
    });

    it('should filter context by lesson and generate response', async () => {
      // Load all lessons
      const allLessons = await JsonRepository.loadAllLessons();
      expect(allLessons.length).toBeGreaterThan(0);

      // Convert to context documents
      const allDocs = JsonRepository.lessonsToContextDocuments(allLessons);
      
      // Filter for specific lesson
      const lesson1Docs = JsonRepository.filterByLessonId(allDocs, 1);
      expect(lesson1Docs.length).toBeGreaterThan(0);

      // Generate Q&A with filtered context
      const client = new VertexGeminiClient();
      const response = await client.qaFromJson(
        lesson1Docs,
        'What expressions are used when making friends?'
      );

      expect(response.answer).toBeDefined();
    });

    it('should filter context by question type and generate response', async () => {
      // Load a lesson
      const lesson = await JsonRepository.loadLesson(1);
      const contextDocs = JsonRepository.lessonToContextDocuments(lesson);

      // Filter for multiple-choice questions
      const multipleChoiceDocs = JsonRepository.filterByQuestionType(
        contextDocs,
        'multiple-choice'
      );

      if (multipleChoiceDocs.length > 0) {
        // Generate Q&A with filtered context
        const client = new VertexGeminiClient();
        const response = await client.qaFromJson(
          multipleChoiceDocs,
          'What are some multiple-choice questions about making friends?'
        );

        expect(response.answer).toBeDefined();
      }
    });
  });

  describe('Feature Flag Support', () => {
    it('should respect USE_VERTEX_AI feature flag', () => {
      process.env.USE_VERTEX_AI = 'true';
      process.env.GEMINI_API_KEY = 'test-api-key';
      
      const client = new VertexGeminiClient();
      expect(client.isConfigured()).toBe(true);
    });

    it('should work when feature flag is false but client is explicitly used', () => {
      process.env.USE_VERTEX_AI = 'false';
      process.env.GEMINI_API_KEY = 'test-api-key';
      
      // Client can still be used even if feature flag is false
      const client = new VertexGeminiClient();
      expect(client.isConfigured()).toBe(true);
    });
  });

  describe('Error Scenarios', () => {
    it('should handle missing API key gracefully', () => {
      delete process.env.GEMINI_API_KEY;
      
      const client = new VertexGeminiClient();
      expect(client.isConfigured()).toBe(false);
    });

    it('should handle invalid lesson ID', async () => {
      await expect(JsonRepository.loadLesson(999)).rejects.toThrow();
    });

    it('should handle empty context documents', async () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      const client = new VertexGeminiClient();
      
      await expect(
        client.qaFromJson([], 'Test question')
      ).rejects.toThrow('No context documents provided');
    });
  });

  describe('Prompt Construction', () => {
    it('should construct meaningful prompts from JSON context', async () => {
      const lesson = await JsonRepository.loadLesson(1);
      const contextDocs = JsonRepository.lessonToContextDocuments(lesson);
      
      // Verify context documents have meaningful content
      contextDocs.forEach((doc) => {
        expect(doc.content).toContain('Question:');
        expect(doc.content).toContain('Answer:');
        expect(doc.content.length).toBeGreaterThan(0);
      });

      // Generate Q&A to verify prompt construction works
      const client = new VertexGeminiClient();
      const response = await client.qaFromJson(
        contextDocs.slice(0, 3), // Use first 3 for faster test
        'Summarize the key points'
      );

      expect(response.answer).toBeDefined();
    });
  });

  describe('Generation Options', () => {
    it('should accept and apply generation options', async () => {
      const lesson = await JsonRepository.loadLesson(1);
      const contextDocs = JsonRepository.lessonToContextDocuments(lesson);
      const client = new VertexGeminiClient();

      const response = await client.qaFromJson(
        contextDocs.slice(0, 2),
        'Test question',
        {
          temperature: 0.3,
          maxTokens: 512,
          topP: 0.9,
          topK: 30,
        }
      );

      expect(response.answer).toBeDefined();
    });
  });
});
