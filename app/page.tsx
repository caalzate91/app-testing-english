'use client';

import { useState } from 'react';
import { Lesson } from '@/app/types';
import { useLessons } from '@/app/hooks/useLessons';
import QuizList from './components/QuizList';
import QuizPage from './components/QuizPage';

type AppState = 'lessons' | 'quiz';

export default function Home(): React.ReactElement {
  const [appState, setAppState] = useState<AppState>('lessons');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const lessons = useLessons();

  // Manejar selección de lección
  const handleSelectLesson = async (lessonId: number): Promise<void> => {
    try {
      await lessons.actions.selectLesson(lessonId);
      if (lessons.selectedLesson) {
        setSelectedLesson(lessons.selectedLesson);
        setAppState('quiz');
      }
    } catch (error) {
      console.error('Error selecting lesson:', error);
      // El error ya se maneja en el hook useLessons
    }
  };

  // Volver a la lista de lecciones
  const handleBackToLessons = (): void => {
    setAppState('lessons');
    setSelectedLesson(null);
    lessons.actions.clearSelectedLesson();
  };

  // Manejar finalización del quiz
  const handleQuizComplete = (score: number, total: number): void => {
    // Aquí se podría implementar guardar estadísticas, mostrar badge, etc.
    // Por ahora solo registramos en desarrollo para debug
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Quiz completado: ${score}/${total} (${Math.round((score / total) * 100)}%)`);
    }
  };

  // Mostrar loading de lección si está seleccionando
  if (appState === 'quiz' && lessons.isLoadingLesson) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto"></div>
          <p className="mt-4 text-slate-300">Cargando lección...</p>
        </div>
      </div>
    );
  }

  // Mostrar error de lección si hay uno
  if (appState === 'quiz' && lessons.lessonError) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-medium text-red-300">
                Error al cargar la lección
              </h3>
            </div>
            <p className="mt-2 text-sm text-red-200">{lessons.lessonError}</p>
            <button 
              onClick={handleBackToLessons}
              className="mt-3 text-sm text-red-300 underline hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
            >
              Volver a lecciones
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar página de quiz si hay una lección seleccionada
  if (appState === 'quiz' && selectedLesson) {
    return (
      <QuizPage
        lesson={selectedLesson}
        onBackToLessons={handleBackToLessons}
        onQuizComplete={handleQuizComplete}
      />
    );
  }

  // Renderizar lista de lecciones por defecto
  return (
    <QuizList
      lessons={lessons.lessons}
      onSelectLesson={handleSelectLesson}
      isLoading={lessons.isLoading}
      error={lessons.error}
    />
  );
}
