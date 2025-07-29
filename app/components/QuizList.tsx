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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm font-medium text-red-800">
              Error al cargar las lecciones
            </h3>
          </div>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 text-sm text-red-800 underline hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            English A2 Practice
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Mejora tu inglés con ejercicios interactivos
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <LessonMenu 
          lessons={lessons}
          onSelectLesson={onSelectLesson}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
