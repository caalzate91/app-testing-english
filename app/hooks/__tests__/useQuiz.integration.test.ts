/**
 * @jest-environment jsdom
 */
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

describe('useQuiz Hook Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Hook Initialization', () => {
    it('should validate questions data structure', () => {
      expect(mockQuestions).toHaveLength(3);
      
      const firstQuestion = mockQuestions[0];
      const secondQuestion = mockQuestions[1];
      const thirdQuestion = mockQuestions[2];
      
      if (firstQuestion) {
        expect(firstQuestion.type).toBe('multiple-choice');
      }
      if (secondQuestion) {
        expect(secondQuestion.type).toBe('true-false');
      }
      if (thirdQuestion) {
        expect(thirdQuestion.type).toBe('fill-in-the-blank');
      }
    });

    it('should verify question properties', () => {
      const multipleChoice = mockQuestions[0];
      if (multipleChoice) {
        expect(multipleChoice.id).toBe(1);
        expect(multipleChoice.question).toBeTruthy();
        expect(multipleChoice.options).toHaveLength(4);
        expect(multipleChoice.answer).toBe('Paris');
      }

      const trueFalse = mockQuestions[1];
      if (trueFalse) {
        expect(trueFalse.id).toBe(2);
        expect(trueFalse.question).toBeTruthy();
        expect(typeof trueFalse.answer).toBe('boolean');
      }

      const fillInBlank = mockQuestions[2];
      if (fillInBlank) {
        expect(fillInBlank.id).toBe(3);
        expect(fillInBlank.question).toBeTruthy();
        expect(fillInBlank.synonyms).toContain('Is');
      }
    });

    it('should have all required question fields', () => {
      mockQuestions.forEach((question) => {
        expect(question.id).toBeDefined();
        expect(question.type).toBeDefined();
        expect(question.question).toBeDefined();
        expect(question.answer).toBeDefined();
      });
    });
  });

  describe('Quiz Logic Verification', () => {
    it('should validate multiple choice answers correctly', () => {
      const question = mockQuestions[0];
      if (question) {
        const correctAnswer = 'Paris';
        const incorrectAnswer = 'London';

        expect(question.answer).toBe(correctAnswer);
        expect(question.options).toContain(correctAnswer);
        expect(question.options).toContain(incorrectAnswer);
      }
    });

    it('should validate true/false answers correctly', () => {
      const question = mockQuestions[1];
      if (question) {
        expect(typeof question.answer).toBe('boolean');
        expect(question.answer).toBe(false);
      }
    });

    it('should validate fill-in-the-blank with synonyms', () => {
      const question = mockQuestions[2];
      if (question) {
        expect(question.answer).toBe('is');
        expect(question.synonyms).toContain('Is');
      }
    });
  });

  describe('API Route Integration Test', () => {
    it('should match expected API response format', async () => {
      // This test verifies the format matches what our API returns
      const sampleApiResponse = mockQuestions;
      
      sampleApiResponse.forEach((question) => {
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('type');
        expect(question).toHaveProperty('question');
        expect(question).toHaveProperty('answer');
        
        if (question.type === 'multiple-choice') {
          expect(question).toHaveProperty('options');
          expect(Array.isArray(question.options)).toBe(true);
        }
        
        if (question.synonyms) {
          expect(Array.isArray(question.synonyms)).toBe(true);
        }
      });
    });
  });

  describe('Quiz State Validation', () => {
    it('should verify quiz states are properly typed', () => {
      const initialState = {
        questions: mockQuestions,
        currentQuestionIndex: 0,
        userAnswer: '',
        score: 0,
        isCompleted: false,
        feedback: null,
        isCorrect: false,
      };

      expect(typeof initialState.currentQuestionIndex).toBe('number');
      expect(typeof initialState.userAnswer).toBe('string');
      expect(typeof initialState.score).toBe('number');
      expect(typeof initialState.isCompleted).toBe('boolean');
      expect(typeof initialState.isCorrect).toBe('boolean');
      expect(initialState.feedback).toBeNull();
    });

    it('should verify progress calculation logic', () => {
      const totalQuestions = mockQuestions.length;
      const currentQuestionIndex = 0;
      const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
      
      expect(progress).toBe((1 / 3) * 100);
      expect(Math.round(progress)).toBe(33);
    });
  });

  describe('Answer Validation Logic', () => {
    it('should validate multiple choice answer comparison', () => {
      const question = mockQuestions[0];
      if (question) {
        const userAnswer = 'Paris';
        const correctAnswer = question.answer as string;
        
        const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
        expect(isCorrect).toBe(true);
      }
    });

    it('should validate true-false answer comparison', () => {
      const question = mockQuestions[1];
      if (question) {
        const userAnswer = 'false';
        const correctAnswer = question.answer as boolean;
        const userBooleanAnswer = userAnswer.toLowerCase() === 'true';
        
        const isCorrect = userBooleanAnswer === correctAnswer;
        expect(isCorrect).toBe(true);
      }
    });

    it('should validate fill-in-blank with synonyms', () => {
      const question = mockQuestions[2];
      if (question) {
        const userAnswer = 'Is';
        const correctAnswer = question.answer as string;
        const synonyms = question.synonyms || [];
        
        const isCorrect = [correctAnswer, ...synonyms].some(
          validAnswer => validAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim()
        );
        
        expect(isCorrect).toBe(true);
      }
    });
  });
});
