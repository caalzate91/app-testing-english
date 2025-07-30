import { useState, useCallback, useEffect } from 'react';
import { Question, QuizState, AnswerValidationResult } from '@/app/types';

interface UseQuizOptions {
  readonly questions: readonly Question[];
  readonly onQuizComplete?: (score: number, total: number) => void;
}

export interface UseQuizReturn {
  readonly state: QuizState;
  readonly currentQuestion: Question | null;
  readonly isAnswerValid: boolean;
  readonly canSubmit: boolean;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly progress: number;
  readonly actions: {
    readonly setUserAnswer: (answer: string) => void;
    readonly submitAnswer: (answer?: string) => void;
    readonly nextQuestion: () => void;
    readonly resetQuiz: () => void;
    readonly completeQuiz: () => void;
  };
}

export function useQuiz({ questions, onQuizComplete }: UseQuizOptions): UseQuizReturn {
  const [state, setState] = useState<QuizState>(() => ({
    questions: [...questions],
    currentQuestionIndex: 0,
    userAnswer: '',
    score: 0,
    isCompleted: false,
    feedback: null,
    isCorrect: false,
  }));

  // Update questions when they change - only check if state is empty and questions provided
  useEffect(() => {
    if (questions.length > 0 && state.questions.length === 0) {
      setState(prev => ({
        ...prev,
        questions: [...questions],
      }));
    }
  }, [questions, state.questions.length]);

  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = state.questions[state.currentQuestionIndex] ?? null;
  const isAnswerValid = state.userAnswer.trim().length > 0;
  const progress = ((state.currentQuestionIndex + 1) / state.questions.length) * 100;
  const canSubmit = isAnswerValid && state.feedback === null;

  const validateAnswer = useCallback((question: Question, userAnswer: string): AnswerValidationResult => {
    if (!userAnswer.trim()) {
      return {
        isValid: false,
        isCorrect: false,
        feedback: 'Por favor, proporciona una respuesta.',
      };
    }

    let isCorrect = false;
    let feedback = '';

    switch (question.type) {
      case 'true-false': {
        const correctAnswer = question.answer as boolean;
        const userBooleanAnswer = userAnswer.toLowerCase() === 'true';
        isCorrect = userBooleanAnswer === correctAnswer;
        
        if (isCorrect) {
          feedback = '¡Correcto! 🎉';
        } else {
          const correctText = correctAnswer ? 'Verdadero' : 'Falso';
          feedback = `Incorrecto. La respuesta correcta es: ${correctText}`;
        }
        break;
      }
      case 'multiple-choice': {
        const correctAnswer = question.answer as string;
        isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
        feedback = isCorrect 
          ? '¡Correcto! 🎉' 
          : `Incorrecto. La respuesta correcta es: ${correctAnswer}`;
        break;
      }
      case 'fill-in-the-blank':
      case 'translation': {
        const correctAnswer = question.answer as string;
        const synonyms = question.synonyms ?? [];
        
        isCorrect = [correctAnswer, ...synonyms].some(
          validAnswer => validAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim()
        );
        
        feedback = isCorrect 
          ? '¡Correcto! 🎉' 
          : `Incorrecto. Una respuesta correcta es: ${correctAnswer}`;
        
        if (question.explanation && !isCorrect) {
          feedback += ` ${question.explanation}`;
        }
        break;
      }
      default: {
        // TypeScript exhaustiveness check - renamed for clarity
        const _unreachableCase: never = question.type;
        throw new Error(`Tipo de pregunta no soportado: ${String(_unreachableCase)}`);
      }
    }

    return {
      isValid: true,
      isCorrect,
      feedback,
    };
  }, []);

  const setUserAnswer = useCallback((answer: string) => {
    // Ensure answer is always a string
    const sanitizedAnswer = typeof answer === 'string' ? answer : String(answer || '');
    
    setState(prev => ({
      ...prev,
      userAnswer: sanitizedAnswer,
      feedback: null,
    }));
  }, []);

  const submitAnswer = useCallback((answer?: string) => {
    setState(prev => {
      const answerToSubmit = answer ?? prev.userAnswer;
      const current = prev.questions[prev.currentQuestionIndex];
      
      // Ensure answerToSubmit is a string and not empty
      if (!current || typeof answerToSubmit !== 'string' || answerToSubmit.trim().length === 0) {
        return prev;
      }

      try {
        const validation = validateAnswer(current, answerToSubmit);
        const newScore = validation.isCorrect ? prev.score + 1 : prev.score;
        const isLastQuestion = prev.currentQuestionIndex >= prev.questions.length - 1;
        
        // If it's the last question, complete the quiz
        if (isLastQuestion) {
          onQuizComplete?.(newScore, prev.questions.length);
          return {
            ...prev,
            userAnswer: answerToSubmit,
            feedback: validation.feedback,
            isCorrect: validation.isCorrect,
            score: newScore,
            isCompleted: true,
          };
        }
        
        return {
          ...prev,
          userAnswer: answerToSubmit,
          feedback: validation.feedback,
          isCorrect: validation.isCorrect,
          score: newScore,
        };
      } catch (err) {
        // Handle error by setting error state
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al validar respuesta';
        setError(errorMessage);
        return prev;
      }
    });
  }, [validateAnswer, onQuizComplete]);

  // Auto-advance to next question after showing feedback
  useEffect(() => {
    if (state.feedback && !state.isCompleted) {
      const isLastQuestion = state.currentQuestionIndex >= state.questions.length - 1;
      if (!isLastQuestion) {
        const timer = setTimeout(() => {
          setState(prev => ({
            ...prev,
            currentQuestionIndex: prev.currentQuestionIndex + 1,
            userAnswer: '',
            feedback: null,
            isCorrect: false,
          }));
        }, 1500); // Show feedback for 1.5 seconds
        
        return () => clearTimeout(timer);
      }
    }
    return undefined;
  }, [state.feedback, state.isCompleted, state.currentQuestionIndex, state.questions.length]);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      const isLastQuestion = prev.currentQuestionIndex >= prev.questions.length - 1;
      
      if (isLastQuestion) {
        // Call onQuizComplete with the current score
        onQuizComplete?.(prev.score, prev.questions.length);
        return {
          ...prev,
          isCompleted: true,
        };
      } else {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          userAnswer: '',
          feedback: null,
          isCorrect: false,
        };
      }
    });
  }, [onQuizComplete]);

  const resetQuiz = useCallback(() => {
    setState({
      questions: [...questions],
      currentQuestionIndex: 0,
      userAnswer: '',
      score: 0,
      isCompleted: false,
      feedback: null,
      isCorrect: false,
    });
    setError(null);
  }, [questions]);

  const completeQuiz = useCallback(() => {
    setState(prev => ({
      ...prev,
      isCompleted: true,
    }));
    onQuizComplete?.(state.score, state.questions.length);
  }, [state.score, state.questions.length, onQuizComplete]);

  return {
    state,
    isLoading,
    error,
    currentQuestion,
    isAnswerValid,
    progress,
    canSubmit,
    actions: {
      setUserAnswer,
      submitAnswer,
      nextQuestion,
      resetQuiz,
      completeQuiz,
    },
  };
}
