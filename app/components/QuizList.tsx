import { LessonMetadata } from '@/app/types';
import LessonMenu from './LessonMenu';

interface QuizListProps {
  readonly lessons: readonly LessonMetadata[];
  readonly onSelectLesson: (lessonId: number) => void;
  readonly isLoading?: boolean;
  readonly error?: string | null;
}

/**
 * Componente contenedor que muestra la lista de quizzes disponibles
 * Incluye manejo de estados de carga y error
 */
export default function QuizList({ 
  lessons, 
  onSelectLesson, 
  isLoading = false, 
  error 
}: QuizListProps): React.ReactElement {
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm font-medium text-red-300">
              Error al cargar las lecciones
            </h3>
          </div>
          <p className="mt-2 text-sm text-red-200">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 text-sm text-red-300 underline hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800/50 shadow-lg border-b border-dark-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-100 gradient-text">
            English A2 Practice
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Mejora tu inglés con ejercicios interactivos
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LessonMenu 
          lessons={lessons}
          onSelectLesson={onSelectLesson}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
