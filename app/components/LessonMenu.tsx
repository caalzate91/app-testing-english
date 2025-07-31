import { LessonMetadata } from '@/app/types';

interface LessonMenuProps {
  readonly lessons: readonly LessonMetadata[];
  readonly onSelectLesson: (lessonId: number) => void;
  readonly selectedLessonId?: number;
  readonly isLoading?: boolean;
}

/**
 * Componente de menú de lecciones con diseño mobile-first responsivo
 * - En móvil: Lista vertical con cards
 * - En tablet/desktop: Grid responsive
 */
export default function LessonMenu({ 
  lessons, 
  onSelectLesson, 
  selectedLessonId,
  isLoading = false 
}: LessonMenuProps): React.ReactElement {
  const getDifficultyColor = (difficulty: LessonMetadata['difficulty']): string => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-900/30 text-green-300 border-green-700/50';
      case 'intermediate':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50';
      case 'advanced':
        return 'bg-red-900/30 text-red-300 border-red-700/50';
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-600/50';
    }
  };

  const getDifficultyLabel = (difficulty: LessonMetadata['difficulty']): string => {
    switch (difficulty) {
      case 'beginner':
        return 'Básico';
      case 'intermediate':
        return 'Intermedio';
      case 'advanced':
        return 'Avanzado';
      default:
        return 'Desconocido';
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="bg-slate-700 h-6 w-48 rounded mb-4" aria-label="Cargando título"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-700 h-24 rounded-lg" aria-label={`Cargando lección ${i}`}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-dark-800/30 backdrop-blur-sm rounded-xl border border-dark-700/50">
      <header className="mb-6">
        <h2 className="text-xl font-bold text-slate-100 mb-2">
          Selecciona una Lección
        </h2>
        <p className="text-sm text-slate-300">
          Elige una lección para comenzar a practicar inglés
        </p>
      </header>

      <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 lg:grid-cols-3">
        {lessons.map((lesson) => {
          const isSelected = selectedLessonId === lesson.id;
          
          return (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-primary-400 bg-primary-900/20 shadow-lg shadow-primary-500/20' 
                  : 'border-dark-600/50 bg-dark-700/30 hover:border-primary-500/50 hover:bg-dark-600/40'
                }
                focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-800
                active:scale-95 backdrop-blur-sm
              `}
              aria-pressed={isSelected}
              aria-label={`Seleccionar lección: ${lesson.title}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-100 text-sm sm:text-base">
                    {lesson.title}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    Lección {lesson.id}
                  </span>
                </div>
                
                <div className={`
                  px-2 py-1 text-xs font-medium rounded-full border
                  ${getDifficultyColor(lesson.difficulty)}
                `}>
                  {getDifficultyLabel(lesson.difficulty)}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mb-3 line-clamp-2">
                {lesson.description}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {lesson.questionsCount} preguntas
                </span>
                
                <span className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded text-xs font-medium">
                  {lesson.level}
                </span>
              </div>

              {lesson.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {lesson.tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag}
                      className="inline-block bg-primary-900/30 text-primary-300 text-xs px-2 py-1 rounded-full border border-primary-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                  {lesson.tags.length > 3 && (
                    <span className="text-xs text-slate-500">
                      +{lesson.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-8">
          <div className="text-slate-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-slate-400">No hay lecciones disponibles</p>
        </div>
      )}
    </div>
  );
}
