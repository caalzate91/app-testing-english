/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useQuiz } from '../useQuiz';
import { Question } from '@/app/types';

// Mock questions for testing
const mockQuestions: Question[] = [
  {
    id: 1,
    type: 'multiple-choice',
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    answer: 'Paris',
  },
  {
    id: 2,
    type: 'true-false',
    question: 'The Earth is flat.',
    answer: false,
  },
  {
    id: 3,
    type: 'fill-in-the-blank',
    question: 'Complete: Hello, my name ___ John.',
    answer: 'is',
    synonyms: ['Is'],
  },
];

describe('useQuiz Hook', () => {
  const mockOnQuizComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with empty state when no questions provided', () => {
      const { result } = renderHook(() =>
        useQuiz({ questions: [], onQuizComplete: mockOnQuizComplete })
      );

      expect(result.current.state.questions).toEqual([]);
      expect(result.current.state.currentQuestionIndex).toBe(0);
      expect(result.current.state.score).toBe(0);
      expect(result.current.state.isCompleted).toBe(false);
      expect(result.current.currentQuestion).toBeNull();
    });

    it('should initialize correctly with provided questions', () => {
      const { result } = renderHook(() =>
        useQuiz({ questions: mockQuestions, onQuizComplete: mockOnQuizComplete })
      );

      expect(result.current.state.questions).toEqual(mockQuestions);
      expect(result.current.state.currentQuestionIndex).toBe(0);
      expect(result.current.currentQuestion).toEqual(mockQuestions[0]);
      expect(result.current.state.score).toBe(0);
      expect(result.current.state.isCompleted).toBe(false);
    });

    it('should update questions when they change', () => {
      const { result, rerender } = renderHook(
        ({ questions }) => useQuiz({ questions, onQuizComplete: mockOnQuizComplete }),
        { initialProps: { questions: [] } }
      );

      // Initially empty
      expect(result.current.state.questions).toEqual([]);
      expect(result.current.currentQuestion).toBeNull();

      // Update with new questions
      rerender({ questions: mockQuestions });

      expect(result.current.state.questions).toEqual(mockQuestions);
      expect(result.current.currentQuestion).toEqual(mockQuestions[0]);
      expect(result.current.state.currentQuestionIndex).toBe(0);
    });
  });

  describe('Answer Management', () => {
    it('should set user answer correctly', () => {
      const { result } = renderHook(() =>
        useQuiz({ questions: mockQuestions, onQuizComplete: mockOnQuizComplete })
      );

      act(() => {
        result.current.actions.setUserAnswer('Paris');
      });

      expect(result.current.state.userAnswer).toBe('Paris');
      expect(result.current.isAnswerValid).toBe(true);
    });

    it('should validate answer as invalid when empty', () => {
      const { result } = renderHook(() =>
        useQuiz({ questions: mockQuestions, onQuizComplete: mockOnQuizComplete })
      );

      expect(result.current.isAnswerValid).toBe(false);
      expect(result.current.canSubmit).toBe(false);
    });

    it('should validate answer as valid when not empty', () => {
      const { result } = renderHook(() =>
        useQuiz({ questions: mockQuestions, onQuizComplete: mockOnQuizComplete })
      );

      act(() => {
        result.current.actions.setUserAnswer('Paris');
      });

      expect(result.current.isAnswerValid).toBe(true);
      expect(result.current.canSubmit).toBe(true);
    });
  });

  describe('Answer Submission and Validation', () => {
    it('should handle correct multiple-choice answer', () => {
      const { result } = renderHook(() =>
        useQuiz({ questions: mockQuestions, onQuizComplete: mockOnQuizComplete })
      );

      act(() => {
        result.current.actions.setUserAnswer('Paris');
      });

      act(() => {
        result.current.actions.submitAnswer();
      });

      expect(result.current.state.isCorrect).toBe(true);
      expect(result.current.state.score).toBe(1);
      expect(result.current.state.feedback).toBe('¡Correcto! 🎉');
    });

    it('should handle incorrect multiple-choice answer', () => {
      const { result } = renderHook(() =>
        useQuiz({ questions: mockQuestions, onQuizComplete: mockOnQuizComplete })
      );

      act(() => {
        result.current.actions.setUserAnswer('London');
      });

      act(() => {
        result.current.actions.submitAnswer();
      });

      expect(result.current.state.isCorrect).toBe(false);
      expect(result.current.state.score).toBe(0);
      expect(result.current.state.feedback).toBe('Incorrecto. La respuesta correcta es: Paris');
    });

    it('should handle correct true-false answer', () => {
      const { result } = renderHook(() =>
        useQuiz({ questions: mockQuestions, onQuizComplete: mockOnQuizComplete })
      );

      // Move to the second question (true-false)
      act(() => {
        result.current.actions.setUserAnswer('Paris');
        result.current.actions.submitAnswer();
        result.current.actions.nextQuestion();
      });

      act(() => {
        result.current.actions.setUserAnswer('false');
      });

      act(() => {
        result.current.actions.submitAnswer();
      });

      expect(result.current.state.isCorrect).toBe(true);
      expect(result.current.state.feedback).toBe('¡Correcto! 🎉');
    });

    it('should handle incorrect true-false answer', () => {
      const { result } = renderHook(() =>
        useQuiz({ questions: mockQuestions, onQuizComplete: mockOnQuizComplete })
      );

      // Move to the second question (true-false)
      act(() => {
        result.current.actions.setUserAnswer('Paris');
        result.current.actions.submitAnswer();
        result.current.actions.nextQuestion();
      });

      act(() => {
        result.current.actions.setUserAnswer('true');
      });

      act(() => {
        result.current.actions.submitAnswer();
      });

      expect(result.current.state.isCorrect).toBe(false);
      expect(result.current.state.feedback).toBe('Incorrecto. La respuesta correcta es: Falso');
    });

    it('should handle fill-in-the-blank with synonyms', () => {
      const { result } = renderHook(() =>
        useQuiz({ questions: mockQuestions, onQuizComplete: mockOnQuizComplete })
      );

      // Move to the third question (fill-in-the-blank)
      act(() => {
        result.current.actions.setUserAnswer('Paris');
        result.current.actions.submitAnswer();
        result.current.actions.nextQuestion();
        result.current.actions.setUserAnswer('false');
        result.current.actions.submitAnswer();
        result.current.actions.nextQuestion();
      });

      // Test with synonym
      act(() => {
        result.current.actions.setUserAnswer('Is');
      });

      act(() => {
        result.current.actions.submitAnswer();
      });

      expect(result.current.state.isCorrect).toBe(true);
      expect(result.current.state.feedback).toBe('¡Correcto! 🎉');
    });
  });

  describe('Quiz Navigation', () => {
    it('should navigate to next question correctly', () => {
      const { result } = renderHook(() =>
        useQuiz({ questions: mockQuestions, onQuizComplete: mockOnQuizComplete })
      );

      // Submit first answer
      act(() => {
        result.current.actions.setUserAnswer('Paris');
        result.current.actions.submitAnswer();
      });

      // Move to next question
      act(() => {
        result.current.actions.nextQuestion();
      });

      expect(result.current.state.currentQuestionIndex).toBe(1);
      expect(result.current.currentQuestion).toEqual(mockQuestions[1]);
      expect(result.current.state.userAnswer).toBe('');
      expect(result.current.state.feedback).toBeNull();
    });

    it('should complete quiz on last question', () => {
      const { result } = renderHook(() =>
        useQuiz({ questions: mockQuestions, onQuizComplete: mockOnQuizComplete })
      );

      // Answer all questions
      act(() => {
        // First question
        result.current.actions.submitAnswer('Paris');
        result.current.actions.nextQuestion();
        
        // Second question
        result.current.actions.submitAnswer('false');
        result.current.actions.nextQuestion();
        
        // Third question (last)
        result.current.actions.submitAnswer('is');
        result.current.actions.nextQuestion(); // This should complete the quiz
      });

      expect(result.current.state.isCompleted).toBe(true);
      expect(mockOnQuizComplete).toHaveBeenCalledWith(3, 3);
    });
  });

  describe('Quiz Reset', () => {
    it('should reset quiz to initial state', () => {
      const { result } = renderHook(() =>
        useQuiz({ questions: mockQuestions, onQuizComplete: mockOnQuizComplete })
      );

      // Progress through quiz
      act(() => {
        result.current.actions.setUserAnswer('Paris');
        result.current.actions.submitAnswer();
        result.current.actions.nextQuestion();
      });

      // Reset quiz
      act(() => {
        result.current.actions.resetQuiz();
      });

      expect(result.current.state.currentQuestionIndex).toBe(0);
      expect(result.current.state.userAnswer).toBe('');
      expect(result.current.state.score).toBe(0);
      expect(result.current.state.isCompleted).toBe(false);
      expect(result.current.state.feedback).toBeNull();
      expect(result.current.currentQuestion).toEqual(mockQuestions[0]);
    });
  });

  describe('Progress Calculation', () => {
    it('should calculate progress correctly', () => {
      const { result } = renderHook(() =>
        useQuiz({ questions: mockQuestions, onQuizComplete: mockOnQuizComplete })
      );

      // Initial progress
      expect(result.current.progress).toBe((1 / 3) * 100);

      // Move to second question
      act(() => {
        result.current.actions.setUserAnswer('Paris');
        result.current.actions.submitAnswer();
        result.current.actions.nextQuestion();
      });

      expect(result.current.progress).toBe((2 / 3) * 100);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid question type gracefully', () => {
      const invalidQuestion = {
        id: 999,
        type: 'invalid-type' as Question['type'],
        question: 'Invalid question',
        answer: 'test',
      };

      const { result } = renderHook(() =>
        useQuiz({ questions: [invalidQuestion], onQuizComplete: mockOnQuizComplete })
      );

      act(() => {
        result.current.actions.setUserAnswer('test');
      });

      act(() => {
        result.current.actions.submitAnswer();
      });

      expect(result.current.error).toContain('Tipo de pregunta no soportado');
    });

    it('should not submit when answer is invalid', () => {
      const { result } = renderHook(() =>
        useQuiz({ questions: mockQuestions, onQuizComplete: mockOnQuizComplete })
      );

      // Try to submit without setting an answer
      act(() => {
        result.current.actions.submitAnswer();
      });

      expect(result.current.state.feedback).toBeNull();
      expect(result.current.state.score).toBe(0);
    });
  });
});
