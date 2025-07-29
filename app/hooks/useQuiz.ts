import { useState, useCallback } from 'react';
import { Question, QuizState, AnswerValidationResult } from '@/app/types';

interface UseQuizOptions {
  readonly questions: readonly Question[];
  readonly onQuizComplete?: (score: number, total: number) => void;
}

interface UseQuizReturn {
  readonly state: QuizState;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly currentQuestion: Question | null;
  readonly isAnswerValid: boolean;
  readonly progress: number;
  readonly canSubmit: boolean;
  readonly actions: {
    readonly setUserAnswer: (answer: string) => void;
    readonly submitAnswer: () => void;
    readonly nextQuestion: () => void;
    readonly resetQuiz: () => void;
    readonly completeQuiz: () => void;
  };
}

export function useQuiz({ questions, onQuizComplete }: UseQuizOptions): UseQuizReturn {
  const [state, setState] = useState<QuizState>({
    questions,
    currentQuestionIndex: 0,
    userAnswer: '',
    score: 0,
    isCompleted: false,
    feedback: null,
    isCorrect: false,
  });

  const [isLoading, setIsLoading] = useState(false);
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
        feedback = isCorrect 
          ? '¡Correcto! 🎉' 
          : `Incorrecto. La respuesta correcta es: ${correctAnswer ? 'Verdadero' : 'Falso'}`;
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
        // TypeScript exhaustiveness check
        const _exhaustive: never = question.type;
        throw new Error(`Tipo de pregunta no soportado: ${String(_exhaustive)}`);
      }
    }

    return {
      isValid: true,
      isCorrect,
      feedback,
    };
  }, []);

  const setUserAnswer = useCallback((answer: string) => {
    setState(prev => ({
      ...prev,
      userAnswer: answer,
      feedback: null,
    }));
  }, []);

  const submitAnswer = useCallback(() => {
    if (!currentQuestion || !canSubmit) {
      return;
    }

    setIsLoading(true);
    
    try {
      const validation = validateAnswer(currentQuestion, state.userAnswer);
      
      setState(prev => ({
        ...prev,
        feedback: validation.feedback,
        isCorrect: validation.isCorrect,
        score: validation.isCorrect ? prev.score + 1 : prev.score,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al validar respuesta';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentQuestion, canSubmit, state.userAnswer, validateAnswer]);

  const nextQuestion = useCallback(() => {
    const isLastQuestion = state.currentQuestionIndex >= state.questions.length - 1;
    
    if (isLastQuestion) {
      setState(prev => ({
        ...prev,
        isCompleted: true,
      }));
      onQuizComplete?.(state.score + (state.isCorrect ? 1 : 0), state.questions.length);
    } else {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        userAnswer: '',
        feedback: null,
        isCorrect: false,
      }));
    }
  }, [state.currentQuestionIndex, state.questions.length, state.score, state.isCorrect, onQuizComplete]);

  const resetQuiz = useCallback(() => {
    setState({
      questions,
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
