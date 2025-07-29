'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/app/types';
import { useQuiz } from '@/app/hooks/useQuiz';
import ProgressBar from './components/ProgressBar';
import QuizQuestion from './components/QuizQuestion';
import QuizResult from './components/QuizResult';
import Feedback from './components/Feedback';

export default function Home(): React.ReactElement {
  const [questionsData, setQuestionsData] = useState<readonly Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async (): Promise<void> => {
      try {
        setIsLoadingQuestions(true);
        const response = await fetch('/api/quiz');
        if (!response.ok) {
          throw new Error(`Failed to fetch questions: ${response.status}`);
        }
        const data = (await response.json()) as Question[];
        setQuestionsData(data);
        setFetchError(null);
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Error desconocido al cargar las preguntas';
        console.error('Error fetching questions:', err);
        setFetchError(`${errorMessage}. Por favor, intenta recargar la página.`);
      } finally {
        setIsLoadingQuestions(false);
      }
    };
    
    fetchQuestions();
  }, []);

  // Initialize quiz hook
  const quiz = useQuiz({
    questions: questionsData,
    onQuizComplete: (score, total) => {
      // Quiz completed successfully
      console.warn(`Quiz completado: ${score}/${total}`);
    },
  });

  // Handle next question logic
  const handleNextQuestion = (): void => {
    setTimeout(() => {
      quiz.actions.nextQuestion();
    }, 3000);
  };

  // Handle answer submission with feedback delay
  const handleAnswerSubmit = (): void => {
    quiz.actions.submitAnswer();
    handleNextQuestion();
  };

  // Handle quiz restart
  const handleRestart = (): void => {
    quiz.actions.resetQuiz();
    // Optionally refetch questions for a new shuffle
    window.location.reload();
  };

  // Loading state
  if (isLoadingQuestions) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl text-center space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="w-20 h-20 bg-primary-200 dark:bg-primary-800 rounded-full mx-auto"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Cargando preguntas...
          </p>
        </div>
      </main>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-danger-500 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl text-white">⚠️</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Error al cargar
            </h1>
            <p className="text-slate-600 dark:text-slate-400">{fetchError}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            🔄 Reintentar
          </button>
        </div>
      </main>
    );
  }

  // Quiz error state
  if (quiz.error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-danger-500 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl text-white">❌</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Error en el quiz
            </h1>
            <p className="text-slate-600 dark:text-slate-400">{quiz.error}</p>
          </div>
          <button
            onClick={quiz.actions.resetQuiz}
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            🔄 Reiniciar Quiz
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text">
            English A2 Quiz
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400">
            Making Friends
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 p-6 sm:p-8 lg:p-12">
          {quiz.state.isCompleted ? (
            <QuizResult
              correctAnswers={quiz.state.score}
              totalQuestions={quiz.state.questions.length}
              onRestart={handleRestart}
            />
          ) : (
            <div className="space-y-8">
              {/* Progress Bar */}
              <ProgressBar
                current={quiz.state.currentQuestionIndex + 1}
                total={quiz.state.questions.length}
                className="mb-8"
              />

              {/* Current Question */}
              {quiz.currentQuestion && (
                <QuizQuestion
                  question={quiz.currentQuestion}
                  userAnswer={quiz.state.userAnswer}
                  onAnswerChange={quiz.actions.setUserAnswer}
                  onSubmit={handleAnswerSubmit}
                  isAnswerValid={quiz.isAnswerValid}
                  feedback={quiz.state.feedback}
                />
              )}

              {/* Feedback */}
              {quiz.state.feedback && (
                <Feedback
                  message={quiz.state.feedback}
                  isCorrect={quiz.state.isCorrect}
                  className="mt-6"
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Cuestionario de inglés nivel A2 • Creado con Next.js y Tailwind CSS
          </p>
        </div>
      </div>
    </main>
  );
}
