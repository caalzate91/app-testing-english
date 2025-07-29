import { Question } from '@/app/types';

export interface Lesson {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly level: string;
  readonly questions: readonly Question[];
}

export interface LessonMetadata {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly level: string;
  readonly questionsCount: number;
  readonly difficulty: 'beginner' | 'intermediate' | 'advanced';
  readonly tags: readonly string[];
}

export interface LessonsIndex {
  readonly lessons: readonly LessonMetadata[];
}

/**
 * Repositorio de datos para gestionar las lecciones y preguntas
 */
export class LessonRepository {
  /**
   * Obtiene la metadata de todas las lecciones disponibles
   */
  static async getLessonsMetadata(): Promise<readonly LessonMetadata[]> {
    try {
      const response = await fetch('/api/lessons');
      if (!response.ok) {
        throw new Error(`Failed to fetch lessons metadata: ${response.status}`);
      }
      const data = await response.json() as LessonsIndex;
      return data.lessons;
    } catch (error) {
      console.error('Error fetching lessons metadata:', error);
      throw new Error('Error al cargar la lista de lecciones');
    }
  }

  /**
   * Obtiene una lección específica por su ID
   */
  static async getLessonById(lessonId: number): Promise<Lesson> {
    try {
      const response = await fetch(`/api/quiz?lessonId=${lessonId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch lesson ${lessonId}: ${response.status}`);
      }
      const lesson = await response.json() as Lesson;
      return lesson;
    } catch (error) {
      console.error(`Error fetching lesson ${lessonId}:`, error);
      throw new Error(`Error al cargar la lección ${lessonId}`);
    }
  }

  /**
   * Valida si existe una lección con el ID especificado
   */
  static async lessonExists(lessonId: number): Promise<boolean> {
    try {
      const lessons = await this.getLessonsMetadata();
      return lessons.some(lesson => lesson.id === lessonId);
    } catch {
      return false;
    }
  }

  /**
   * Obtiene solo las preguntas de una lección específica
   */
  static async getQuestionsByLessonId(lessonId: number): Promise<readonly Question[]> {
    const lesson = await this.getLessonById(lessonId);
    return lesson.questions;
  }
}
