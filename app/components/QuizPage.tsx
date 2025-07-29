import { Lesson } from '@/app/types';
import { useQuiz } from '@/app/hooks/useQuiz';
import ProgressBar from './ProgressBar';
import QuizQuestion from './QuizQuestion';
import QuizResult from './QuizResult';
import Feedback from './Feedback';

interface QuizPageProps {
  readonly lesson: Lesson;
  readonly onBackToLessons: () => void;
  readonly onQuizComplete?: (score: number, total: number) => void;
}

/**
 * Componente que maneja la presentación y flujo de un quiz específico
 * Incluye navegación, progreso y resultados
 */
export default function QuizPage({ 
  lesson, 
  onBackToLessons, 
  onQuizComplete 
}: QuizPageProps): React.ReactElement {
  const quiz = useQuiz({
    questions: lesson.questions,
    onQuizComplete: onQuizComplete || (() => {}),
  });

  if (quiz.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando quiz...</p>
        </div>
      </div>
    );
  }

  if (quiz.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-medium text-red-800">
                Error en el quiz
              </h3>
            </div>
            <p className="mt-2 text-sm text-red-700">{quiz.error}</p>
            <div className="mt-4 flex space-x-2">
              <button 
                onClick={quiz.actions.resetQuiz}
                className="text-sm text-red-800 underline hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
              >
                Reintentar
              </button>
              <button 
                onClick={onBackToLessons}
                className="text-sm text-red-800 underline hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
              >
                Volver a lecciones
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToLessons}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Volver a lecciones"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Volver a lecciones</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {lesson.title}
              </h1>
              <p className="text-sm text-gray-600">
                {lesson.description}
              </p>
            </div>
            
            <div className="w-24"></div> {/* Spacer para centrar el título */}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Barra de progreso */}
        <div className="mb-6">
          <ProgressBar 
            current={quiz.state.currentQuestionIndex + 1}
            total={quiz.state.questions.length}
          />
        </div>

        {/* Quiz completado */}
        {quiz.state.isCompleted ? (
          <QuizResult
            correctAnswers={quiz.state.score}
            totalQuestions={quiz.state.questions.length}
            onRestart={quiz.actions.resetQuiz}
          />
        ) : (
          /* Quiz activo */
          <div className="space-y-6">
            {/* Pregunta actual */}
            {quiz.currentQuestion && (
              <QuizQuestion
                question={quiz.currentQuestion}
                userAnswer={quiz.state.userAnswer}
                onAnswerChange={quiz.actions.setUserAnswer}
                onSubmit={quiz.actions.submitAnswer}
                isAnswerValid={quiz.isAnswerValid}
                feedback={quiz.state.feedback}
              />
            )}

            {/* Feedback */}
            {quiz.state.feedback && (
              <div className="space-y-4">
                <Feedback
                  message={quiz.state.feedback}
                  isCorrect={quiz.state.isCorrect}
                />
                
                {/* Botón para continuar */}
                <div className="text-center">
                  <button
                    onClick={quiz.actions.nextQuestion}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    {quiz.state.currentQuestionIndex >= quiz.state.questions.length - 1 ? 'Ver resultados' : 'Siguiente pregunta'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
