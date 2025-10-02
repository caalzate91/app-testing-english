import { Lesson, Question } from '../../types';
import { ContextDocument } from './types';

/**
 * Repository for loading and managing JSON lesson data
 * Provides utilities to convert lesson data into context documents
 * for use with the Vertex AI adapter
 */
export class JsonRepository {
  /**
   * Load a specific lesson by ID
   * @param lessonId The ID of the lesson to load
   * @returns Promise with the lesson data
   */
  static async loadLesson(lessonId: number): Promise<Lesson> {
    try {
      const lessonData = await import(`@/app/data/lesson${lessonId}.json`);
      return lessonData.default as Lesson;
    } catch (error) {
      throw new Error(`Failed to load lesson ${lessonId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load all available lessons
   * @returns Promise with array of all lessons
   */
  static async loadAllLessons(): Promise<readonly Lesson[]> {
    const lessons: Lesson[] = [];
    
    // Load lessons 1-11 based on the repository structure
    for (let i = 1; i <= 11; i++) {
      try {
        const lesson = await this.loadLesson(i);
        lessons.push(lesson);
      } catch (error) {
        console.error(`Error loading lesson ${i}:`, error);
        // Continue loading other lessons
      }
    }
    
    return lessons;
  }

  /**
   * Convert a lesson to context documents
   * Each question becomes a separate context document
   * @param lesson The lesson to convert
   * @returns Array of context documents
   */
  static lessonToContextDocuments(lesson: Lesson): readonly ContextDocument[] {
    return lesson.questions.map((question: Question) => ({
      id: question.id,
      title: `${lesson.title} - Question ${question.id}`,
      content: this.formatQuestionAsContext(question),
      metadata: {
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        questionType: question.type,
        level: lesson.level,
      },
    }));
  }

  /**
   * Convert multiple lessons to context documents
   * @param lessons Array of lessons to convert
   * @returns Array of context documents
   */
  static lessonsToContextDocuments(lessons: readonly Lesson[]): readonly ContextDocument[] {
    return lessons.flatMap((lesson) => this.lessonToContextDocuments(lesson));
  }

  /**
   * Format a question as readable context text
   * @param question The question to format
   * @returns Formatted context string
   */
  private static formatQuestionAsContext(question: Question): string {
    let context = `Question: ${question.question}\n`;
    context += `Type: ${question.type}\n`;
    
    if (question.options && question.options.length > 0) {
      context += `Options: ${question.options.join(', ')}\n`;
    }
    
    context += `Answer: ${question.answer}\n`;
    
    if (question.synonyms && question.synonyms.length > 0) {
      context += `Synonyms: ${question.synonyms.join(', ')}\n`;
    }
    
    if (question.explanation) {
      context += `Explanation: ${question.explanation}\n`;
    }
    
    return context;
  }

  /**
   * Filter context documents by lesson ID
   * @param documents Array of context documents
   * @param lessonId The lesson ID to filter by
   * @returns Filtered array of context documents
   */
  static filterByLessonId(
    documents: readonly ContextDocument[],
    lessonId: number
  ): readonly ContextDocument[] {
    return documents.filter(
      (doc) => doc.metadata && typeof doc.metadata.lessonId === 'number' && doc.metadata.lessonId === lessonId
    );
  }

  /**
   * Filter context documents by question type
   * @param documents Array of context documents
   * @param questionType The question type to filter by
   * @returns Filtered array of context documents
   */
  static filterByQuestionType(
    documents: readonly ContextDocument[],
    questionType: string
  ): readonly ContextDocument[] {
    return documents.filter(
      (doc) => doc.metadata && doc.metadata.questionType === questionType
    );
  }
}
