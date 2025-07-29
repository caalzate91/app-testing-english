import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizPage from '../QuizPage';
import type { Lesson } from '../../types';

jest.mock('../../hooks/useQuiz', () => ({
  useQuiz: () => ({
    state: {
      questions: [],
      currentQuestionIndex: 0,
      userAnswer: '',
      score: 0,
      isCompleted: false,
      feedback: null,
      isCorrect: false,
    },
    nextQuestion: jest.fn(),
    submitAnswer: jest.fn(),
    resetQuiz: jest.fn(),
    updateUserAnswer: jest.fn(),
    isLoading: false,
    error: null,
  }),
}));

const mockLesson: Lesson = {
  id: 1,
  title: 'Basic Conversations',
  description: 'Learn everyday phrases and greetings',
  level: 'beginner',
  questions: [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the correct greeting?',
      options: ['Hello', 'Goodbye', 'Thank you', 'Sorry'],
      answer: 'Hello',
      explanation: 'Hello is a common greeting in English.',
    },
  ],
};

describe('QuizPage', () => {
  it('should render without crashing', () => {
    render(
      <QuizPage 
        lesson={mockLesson}
        onBackToLessons={jest.fn()}
      />
    );
    expect(screen.getByText('Basic Conversations')).toBeInTheDocument();
  });
});
