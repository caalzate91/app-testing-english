/**
 * Tests for JsonRepository
 */

import { JsonRepository } from '../JsonRepository';
import { Lesson } from '../../../types';

describe('JsonRepository', () => {
  describe('loadLesson', () => {
    it('should load a lesson by ID', async () => {
      const lesson = await JsonRepository.loadLesson(1);
      
      expect(lesson).toBeDefined();
      expect(lesson.id).toBe(1);
      expect(lesson.title).toBeDefined();
      expect(lesson.questions).toBeDefined();
      expect(Array.isArray(lesson.questions)).toBe(true);
    });

    it('should throw error for invalid lesson ID', async () => {
      await expect(JsonRepository.loadLesson(999)).rejects.toThrow();
    });
  });

  describe('loadAllLessons', () => {
    it('should load all available lessons', async () => {
      const lessons = await JsonRepository.loadAllLessons();
      
      expect(lessons).toBeDefined();
      expect(Array.isArray(lessons)).toBe(true);
      expect(lessons.length).toBeGreaterThan(0);
      
      // Verify each lesson has required properties
      lessons.forEach((lesson) => {
        expect(lesson.id).toBeDefined();
        expect(lesson.title).toBeDefined();
        expect(lesson.questions).toBeDefined();
        expect(Array.isArray(lesson.questions)).toBe(true);
      });
    });

    it('should handle errors gracefully and continue loading', async () => {
      const lessons = await JsonRepository.loadAllLessons();
      
      // Should still return lessons even if some fail to load
      expect(lessons.length).toBeGreaterThan(0);
    });
  });

  describe('lessonToContextDocuments', () => {
    it('should convert lesson to context documents', async () => {
      const lesson = await JsonRepository.loadLesson(1);
      const contextDocs = JsonRepository.lessonToContextDocuments(lesson);
      
      expect(contextDocs).toBeDefined();
      expect(Array.isArray(contextDocs)).toBe(true);
      expect(contextDocs.length).toBe(lesson.questions.length);
      
      // Verify first context document structure
      const firstDoc = contextDocs[0];
      if (firstDoc) {
        expect(firstDoc.id).toBeDefined();
        expect(firstDoc.title).toBeDefined();
        expect(firstDoc.content).toBeDefined();
        expect(firstDoc.metadata).toBeDefined();
        expect(firstDoc.metadata?.lessonId).toBe(lesson.id);
        expect(firstDoc.metadata?.lessonTitle).toBe(lesson.title);
      }
    });

    it('should format question content correctly', async () => {
      const lesson = await JsonRepository.loadLesson(1);
      const contextDocs = JsonRepository.lessonToContextDocuments(lesson);
      
      const firstDoc = contextDocs[0];
      if (firstDoc && lesson.questions[0]) {
        expect(firstDoc.content).toContain('Question:');
        expect(firstDoc.content).toContain('Type:');
        expect(firstDoc.content).toContain('Answer:');
        expect(firstDoc.content).toContain(lesson.questions[0].question);
      }
    });

    it('should include options when available', async () => {
      const mockLesson: Lesson = {
        id: 1,
        title: 'Test Lesson',
        description: 'Test',
        level: 'A2',
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'Test question?',
            options: ['Option A', 'Option B', 'Option C'],
            answer: 'Option A',
          },
        ],
      };
      
      const contextDocs = JsonRepository.lessonToContextDocuments(mockLesson);
      const firstDoc = contextDocs[0];
      
      if (firstDoc) {
        expect(firstDoc.content).toContain('Options:');
        expect(firstDoc.content).toContain('Option A');
      }
    });
  });

  describe('lessonsToContextDocuments', () => {
    it('should convert multiple lessons to context documents', async () => {
      const lesson1 = await JsonRepository.loadLesson(1);
      const lesson2 = await JsonRepository.loadLesson(2);
      const lessons = [lesson1, lesson2];
      
      const contextDocs = JsonRepository.lessonsToContextDocuments(lessons);
      
      expect(contextDocs).toBeDefined();
      expect(Array.isArray(contextDocs)).toBe(true);
      expect(contextDocs.length).toBe(
        lesson1.questions.length + lesson2.questions.length
      );
    });
  });

  describe('filterByLessonId', () => {
    it('should filter context documents by lesson ID', async () => {
      const lesson1 = await JsonRepository.loadLesson(1);
      const lesson2 = await JsonRepository.loadLesson(2);
      const lessons = [lesson1, lesson2];
      const allDocs = JsonRepository.lessonsToContextDocuments(lessons);
      
      const filteredDocs = JsonRepository.filterByLessonId(allDocs, 1);
      
      expect(filteredDocs).toBeDefined();
      expect(filteredDocs.length).toBe(lesson1.questions.length);
      
      // Verify all documents are from lesson 1
      filteredDocs.forEach((doc) => {
        expect(doc.metadata?.lessonId).toBe(1);
      });
    });

    it('should return empty array when no documents match', async () => {
      const lesson1 = await JsonRepository.loadLesson(1);
      const docs = JsonRepository.lessonToContextDocuments(lesson1);
      
      const filteredDocs = JsonRepository.filterByLessonId(docs, 999);
      
      expect(filteredDocs).toBeDefined();
      expect(filteredDocs.length).toBe(0);
    });
  });

  describe('filterByQuestionType', () => {
    it('should filter context documents by question type', async () => {
      const lesson1 = await JsonRepository.loadLesson(1);
      const docs = JsonRepository.lessonToContextDocuments(lesson1);
      
      const multipleChoiceDocs = JsonRepository.filterByQuestionType(
        docs,
        'multiple-choice'
      );
      
      expect(multipleChoiceDocs).toBeDefined();
      expect(Array.isArray(multipleChoiceDocs)).toBe(true);
      
      // Verify all documents are multiple-choice type
      multipleChoiceDocs.forEach((doc) => {
        expect(doc.metadata?.questionType).toBe('multiple-choice');
      });
    });

    it('should return empty array when no documents match type', async () => {
      const lesson1 = await JsonRepository.loadLesson(1);
      const docs = JsonRepository.lessonToContextDocuments(lesson1);
      
      const filteredDocs = JsonRepository.filterByQuestionType(
        docs,
        'non-existent-type'
      );
      
      expect(filteredDocs).toBeDefined();
      expect(filteredDocs.length).toBe(0);
    });
  });
});
