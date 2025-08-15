import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizList from '../QuizList';
import type { LessonMetadata } from '../../types';

const mockLessons: LessonMetadata[] = [
  {
    id: 1,
    title: 'Basic Conversations',
    description: 'Learn everyday phrases and greetings',
    level: 'beginner',
    questionsCount: 10,
    difficulty: 'beginner',
    tags: ['greetings', 'basic', 'conversation'],
  },
  {
    id: 2,
    title: 'Family Members',
    description: 'Vocabulary about family relationships',
    level: 'intermediate',
    questionsCount: 8,
    difficulty: 'intermediate',
    tags: ['family', 'vocabulary', 'relationships'],
  },
];

const mockOnSelectLesson = jest.fn();

describe('QuizList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render quiz list with header', () => {
      render(
        <QuizList 
          lessons={mockLessons} 
          onSelectLesson={mockOnSelectLesson} 
        />
      );

      expect(screen.getByText('English A2 Practice')).toBeInTheDocument();
      expect(screen.getByText('Mejora tu inglés con ejercicios interactivos')).toBeInTheDocument();
    });

    it('should render lesson menu component', () => {
      render(
        <QuizList 
          lessons={mockLessons} 
          onSelectLesson={mockOnSelectLesson} 
        />
      );

      expect(screen.getByText('Basic Conversations')).toBeInTheDocument();
      expect(screen.getByText('Family Members')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading state when lessons are loading', () => {
      render(
        <QuizList 
          lessons={[]} 
          onSelectLesson={mockOnSelectLesson} 
          isLoading={true}
        />
      );

      expect(screen.getByLabelText('Cargando título')).toBeInTheDocument();
      expect(screen.getByLabelText('Cargando lección 1')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error message when there is an error', () => {
      render(
        <QuizList 
          lessons={[]} 
          onSelectLesson={mockOnSelectLesson} 
          error="Error de conexión"
        />
      );

      expect(screen.getByText('Error al cargar las lecciones')).toBeInTheDocument();
      expect(screen.getByText('Error de conexión')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /intentar de nuevo/i })).toBeInTheDocument();
    });

    it('should reload page when retry button is clicked', () => {
      const mockReload = jest.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: mockReload },
        writable: true,
      });

      render(
        <QuizList 
          lessons={[]} 
          onSelectLesson={mockOnSelectLesson} 
          error="Error de conexión"
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /intentar de nuevo/i }));
      expect(mockReload).toHaveBeenCalledTimes(1);
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no lessons are available', () => {
      render(
        <QuizList 
          lessons={[]} 
          onSelectLesson={mockOnSelectLesson} 
        />
      );

      expect(screen.getByText('No hay lecciones disponibles')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onSelectLesson when a lesson is selected', () => {
      render(
        <QuizList 
          lessons={mockLessons} 
          onSelectLesson={mockOnSelectLesson} 
        />
      );

      fireEvent.click(screen.getByLabelText('Seleccionar lección: Basic Conversations'));
      expect(mockOnSelectLesson).toHaveBeenCalledWith(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(
        <QuizList 
          lessons={mockLessons} 
          onSelectLesson={mockOnSelectLesson} 
        />
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getAllByRole('banner')).toHaveLength(2); // App header and lesson section header
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
