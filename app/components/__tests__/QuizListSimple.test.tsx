import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizList from '../QuizList';

describe('QuizList', () => {
  it('should render', () => {
    const mockLessons = [
      {
        id: 1,
        title: 'Test Lesson',
        description: 'Test Description',
        level: 'beginner',
        questionsCount: 5,
        difficulty: 'beginner' as const,
        tags: ['test'],
      },
    ];

    render(
      <QuizList 
        lessons={mockLessons} 
        onSelectLesson={() => {}}
      />
    );

    expect(screen.getByText('English A2 Practice')).toBeInTheDocument();
  });
});
