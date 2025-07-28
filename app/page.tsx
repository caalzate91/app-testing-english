'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/app/types';
import ProgressBar from './components/ProgressBar';
import QuizQuestion from './components/QuizQuestion';
import QuizResult from './components/QuizResult';
import Feedback from './components/Feedback';

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/quiz');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data: Question[] = await response.json();
        setQuestions(data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError('Error al cargar las preguntas. Por favor, intenta recargar la página.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerSubmit = () => {
    if (!userAnswer.trim()) {
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    let answerIsCorrect = false;

    if (currentQuestion.type === 'true-false') {
      answerIsCorrect = (userAnswer.toLowerCase() === String(currentQuestion.answer));
    } else {
      answerIsCorrect = userAnswer.trim().toLowerCase() === String(currentQuestion.answer).toLowerCase();
    }

    setIsCorrect(answerIsCorrect);

    if (answerIsCorrect) {
      setCorrectAnswers(prev => prev + 1);
      let correctFeedback = "¡Correcto! 🎉";
      if (currentQuestion.synonyms) {
        correctFeedback += ` Sinónimos: ${currentQuestion.synonyms.join(', ')}.`;
      }
      setFeedback(correctFeedback);
    } else {
      setFeedback(`Incorrecto. La respuesta correcta es: ${currentQuestion.answer}`);
    }

    // Show feedback for 3 seconds, then move to next question
    setTimeout(() => {
      setFeedback(null);
      setUserAnswer('');
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setShowSummary(true);
      }
    }, 3000);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setCorrectAnswers(0);
    setShowSummary(false);
    setIsCorrect(false);
    // Refetch questions to get a new shuffle
    window.location.reload();
  };

  const isAnswerValid = userAnswer.trim().length > 0;

  // Loading state
  if (isLoading) {
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
  if (error) {
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
            <p className="text-slate-600 dark:text-slate-400">{error}</p>
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
          {showSummary ? (
            <QuizResult
              correctAnswers={correctAnswers}
              totalQuestions={questions.length}
              onRestart={handleRestart}
            />
          ) : (
            <div className="space-y-8">
              {/* Progress Bar */}
              <ProgressBar
                current={currentQuestionIndex + 1}
                total={questions.length}
                className="mb-8"
              />

              {/* Current Question */}
              {questions.length > 0 && (
                <QuizQuestion
                  question={questions[currentQuestionIndex]}
                  userAnswer={userAnswer}
                  onAnswerChange={setUserAnswer}
                  onSubmit={handleAnswerSubmit}
                  isAnswerValid={isAnswerValid}
                  feedback={feedback}
                />
              )}

              {/* Feedback */}
              {feedback && (
                <Feedback
                  message={feedback}
                  isCorrect={isCorrect}
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
