import { useState, useEffect, useCallback } from 'react';
import { LessonMetadata, Lesson } from '@/app/types';
import { LessonRepository } from '@/app/lib/data/lesson-repository';

interface UseLessonsReturn {
  readonly lessons: readonly LessonMetadata[];
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly selectedLesson: Lesson | null;
  readonly isLoadingLesson: boolean;
  readonly lessonError: string | null;
  readonly actions: {
    readonly selectLesson: (lessonId: number) => Promise<void>;
    readonly clearSelectedLesson: () => void;
    readonly refetchLessons: () => Promise<void>;
  };
}

/**
 * Hook personalizado para gestionar la carga y selección de lecciones
 * Maneja el estado de la lista de lecciones y la lección seleccionada por separado
 */
export function useLessons(): UseLessonsReturn {
  // Estado para la lista de lecciones
  const [lessons, setLessons] = useState<readonly LessonMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para la lección seleccionada
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);

  // Cargar lista de lecciones
  const fetchLessons = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const lessonsData = await LessonRepository.getLessonsMetadata();
      setLessons(lessonsData);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error desconocido al cargar las lecciones';
      setError(errorMessage);
      console.error('Error fetching lessons:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar lecciones al montar el componente
  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  // Seleccionar una lección específica
  const selectLesson = useCallback(async (lessonId: number): Promise<void> => {
    try {
      setIsLoadingLesson(true);
      setLessonError(null);
      const lesson = await LessonRepository.getLessonById(lessonId);
      setSelectedLesson(lesson);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : `Error desconocido al cargar la lección ${lessonId}`;
      setLessonError(errorMessage);
      console.error(`Error fetching lesson ${lessonId}:`, err);
    } finally {
      setIsLoadingLesson(false);
    }
  }, []);

  // Limpiar la lección seleccionada
  const clearSelectedLesson = useCallback((): void => {
    setSelectedLesson(null);
    setLessonError(null);
  }, []);

  // Refrescar la lista de lecciones
  const refetchLessons = useCallback(async (): Promise<void> => {
    await fetchLessons();
  }, [fetchLessons]);

  return {
    lessons,
    isLoading,
    error,
    selectedLesson,
    isLoadingLesson,
    lessonError,
    actions: {
      selectLesson,
      clearSelectedLesson,
      refetchLessons,
    },
  };
}
