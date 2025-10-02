/**
 * Tests for VertexGeminiClient
 */

import { VertexGeminiClient } from '../VertexGeminiClient';
import { ContextDocument } from '../types';

// Mock the Google Generative AI SDK
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue({
            response: {
              text: jest.fn().mockReturnValue('Mocked response text'),
            },
          }),
        }),
      };
    }),
  };
});

describe('VertexGeminiClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('constructor and initialization', () => {
    it('should initialize with API key from environment', () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      
      const client = new VertexGeminiClient();
      
      expect(client).toBeDefined();
      expect(client.isConfigured()).toBe(true);
    });

    it('should initialize with config object', () => {
      const client = new VertexGeminiClient({
        apiKey: 'test-api-key',
        projectId: 'test-project',
        location: 'us-central1',
        model: 'gemini-2.0-flash-exp',
      });
      
      expect(client).toBeDefined();
      expect(client.isConfigured()).toBe(true);
    });

    it('should warn when API key is not configured', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      delete process.env.GEMINI_API_KEY;
      
      const client = new VertexGeminiClient();
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Vertex AI API key not configured')
      );
      expect(client.isConfigured()).toBe(false);
      
      consoleWarnSpy.mockRestore();
    });

    it('should use default values for optional config', () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      delete process.env.VERTEX_LOCATION;
      delete process.env.VERTEX_MODEL;
      
      const client = new VertexGeminiClient();
      
      expect(client).toBeDefined();
      expect(client.isConfigured()).toBe(true);
    });
  });

  describe('isConfigured', () => {
    it('should return true when properly configured', () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      const client = new VertexGeminiClient();
      
      expect(client.isConfigured()).toBe(true);
    });

    it('should return false when API key is missing', () => {
      delete process.env.GEMINI_API_KEY;
      const client = new VertexGeminiClient();
      
      expect(client.isConfigured()).toBe(false);
    });
  });

  describe('generateAnswer', () => {
    it('should generate answer for a prompt', async () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      const client = new VertexGeminiClient();
      
      const answer = await client.generateAnswer('What is a listener?');
      
      expect(answer).toBeDefined();
      expect(typeof answer).toBe('string');
      expect(answer.length).toBeGreaterThan(0);
    });

    it('should throw error when not configured', async () => {
      delete process.env.GEMINI_API_KEY;
      const client = new VertexGeminiClient();
      
      await expect(
        client.generateAnswer('What is a listener?')
      ).rejects.toThrow('Vertex AI client is not configured');
    });

    it('should accept generation options', async () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      const client = new VertexGeminiClient();
      
      const answer = await client.generateAnswer('What is a listener?', {
        temperature: 0.5,
        maxTokens: 512,
        topP: 0.9,
        topK: 30,
      });
      
      expect(answer).toBeDefined();
    });
  });

  describe('qaFromJson', () => {
    const mockContextDocs: ContextDocument[] = [
      {
        id: 1,
        title: 'Making Friends - Question 1',
        content: 'Question: What is a listener?\nAnswer: Someone who enjoys listening to others',
        metadata: {
          lessonId: 1,
          lessonTitle: 'Making Friends',
          questionType: 'multiple-choice',
        },
      },
      {
        id: 2,
        title: 'Making Friends - Question 2',
        content: 'Question: How to greet someone?\nAnswer: Hello, nice to meet you',
        metadata: {
          lessonId: 1,
          lessonTitle: 'Making Friends',
          questionType: 'translation',
        },
      },
    ];

    it('should generate Q&A response with context', async () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      const client = new VertexGeminiClient();
      
      const response = await client.qaFromJson(
        mockContextDocs,
        'What is a listener?'
      );
      
      expect(response).toBeDefined();
      expect(response.answer).toBeDefined();
      expect(typeof response.answer).toBe('string');
      expect(response.sources).toBeDefined();
      expect(Array.isArray(response.sources)).toBe(true);
    });

    it('should include sources from context documents', async () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      const client = new VertexGeminiClient();
      
      const response = await client.qaFromJson(
        mockContextDocs,
        'What is a listener?'
      );
      
      expect(response.sources).toContain('Making Friends');
    });

    it('should throw error when not configured', async () => {
      delete process.env.GEMINI_API_KEY;
      const client = new VertexGeminiClient();
      
      await expect(
        client.qaFromJson(mockContextDocs, 'What is a listener?')
      ).rejects.toThrow('Vertex AI client is not configured');
    });

    it('should throw error when no context documents provided', async () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      const client = new VertexGeminiClient();
      
      await expect(
        client.qaFromJson([], 'What is a listener?')
      ).rejects.toThrow('No context documents provided');
    });

    it('should accept generation options', async () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      const client = new VertexGeminiClient();
      
      const response = await client.qaFromJson(
        mockContextDocs,
        'What is a listener?',
        {
          temperature: 0.3,
          maxTokens: 256,
        }
      );
      
      expect(response).toBeDefined();
      expect(response.answer).toBeDefined();
    });
  });

  describe('prompt construction', () => {
    it('should build grounded prompt with context', async () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      const client = new VertexGeminiClient();
      
      const mockDocs: ContextDocument[] = [
        {
          id: 1,
          title: 'Test Document',
          content: 'Test content',
          metadata: { lessonTitle: 'Test Lesson' },
        },
      ];
      
      // Test that the method works and returns a response
      const response = await client.qaFromJson(mockDocs, 'Test question?');
      
      expect(response).toBeDefined();
      expect(response.answer).toBeDefined();
    });

    it('should handle multiple context documents', async () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      const client = new VertexGeminiClient();
      
      const mockDocs: ContextDocument[] = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        title: `Document ${i + 1}`,
        content: `Content ${i + 1}`,
        metadata: { lessonTitle: `Lesson ${i + 1}` },
      }));
      
      const response = await client.qaFromJson(mockDocs, 'Test question?');
      
      expect(response).toBeDefined();
      expect(response.sources.length).toBeGreaterThan(0);
    });
  });

  describe('error handling', () => {
    it('should handle SDK errors gracefully', async () => {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      GoogleGenerativeAI.mockImplementationOnce(() => {
        return {
          getGenerativeModel: jest.fn().mockReturnValue({
            generateContent: jest.fn().mockRejectedValue(new Error('SDK error')),
          }),
        };
      });
      
      process.env.GEMINI_API_KEY = 'test-api-key';
      const client = new VertexGeminiClient();
      
      await expect(
        client.generateAnswer('Test prompt')
      ).rejects.toThrow('Failed to generate answer');
    });

    it('should handle empty response from SDK', async () => {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      GoogleGenerativeAI.mockImplementationOnce(() => {
        return {
          getGenerativeModel: jest.fn().mockReturnValue({
            generateContent: jest.fn().mockResolvedValue({
              response: {
                text: jest.fn().mockReturnValue(''),
              },
            }),
          }),
        };
      });
      
      process.env.GEMINI_API_KEY = 'test-api-key';
      const client = new VertexGeminiClient();
      
      await expect(
        client.generateAnswer('Test prompt')
      ).rejects.toThrow('Empty response from Vertex AI');
    });
  });
});
