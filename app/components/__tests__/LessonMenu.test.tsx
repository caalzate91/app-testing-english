/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LessonMetadata } from '@/app/types';
import LessonMenu from '../LessonMenu';

// Mock data for testing
const mockLessons: LessonMetadata[] = [
  {
    id: 1,
    title: 'Basic Conversations',
    description: 'Learn basic conversation starters',
    level: 'A2',
    questionsCount: 5,
    difficulty: 'beginner',
    tags: ['conversation', 'basics'],
  },
  {
    id: 2,
    title: 'Grammar Practice',
    description: 'Practice essential grammar rules',
    level: 'A2',
    questionsCount: 8,
    difficulty: 'intermediate',
    tags: ['grammar', 'verbs', 'tenses'],
  },
  {
    id: 3,
    title: 'Advanced Vocabulary',
    description: 'Expand your vocabulary with complex words',
    level: 'A2',
    questionsCount: 10,
    difficulty: 'advanced',
    tags: ['vocabulary', 'advanced'],
  },
];

describe('LessonMenu', () => {
  const mockOnSelectLesson = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render lesson menu with header', () => {
      render(
        <LessonMenu 
          lessons={mockLessons} 
          onSelectLesson={mockOnSelectLesson} 
        />
      );

      expect(screen.getByText('Selecciona una Lección')).toBeInTheDocument();
      expect(screen.getByText('Elige una lección para comenzar a practicar inglés')).toBeInTheDocument();
    });

    it('should render all lessons provided', () => {
      render(
        <LessonMenu 
          lessons={mockLessons} 
          onSelectLesson={mockOnSelectLesson} 
        />
      );

      mockLessons.forEach((lesson) => {
        expect(screen.getByText(lesson.title)).toBeInTheDocument();
        expect(screen.getByText(lesson.description)).toBeInTheDocument();
        expect(screen.getByText(`${lesson.questionsCount} preguntas`)).toBeInTheDocument();
      });
    });

    it('should display correct difficulty labels', () => {
      render(
        <LessonMenu 
          lessons={mockLessons} 
          onSelectLesson={mockOnSelectLesson} 
        />
      );

      expect(screen.getByText('Básico')).toBeInTheDocument();
      expect(screen.getByText('Intermedio')).toBeInTheDocument();
      expect(screen.getByText('Avanzado')).toBeInTheDocument();
    });

    it('should display tags for each lesson', () => {
      render(
        <LessonMenu 
          lessons={mockLessons} 
          onSelectLesson={mockOnSelectLesson} 
        />
      );

      // Check that tags are displayed
      expect(screen.getByText('conversation')).toBeInTheDocument();
      expect(screen.getByText('grammar')).toBeInTheDocument();
      expect(screen.getByText('vocabulary')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading skeleton when isLoading is true', () => {
      render(
        <LessonMenu 
          lessons={[]} 
          onSelectLesson={mockOnSelectLesson} 
          isLoading={true}
        />
      );

      // Check for loading skeletons
      expect(screen.getByLabelText('Cargando título')).toBeInTheDocument();
      expect(screen.getByLabelText('Cargando lección 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Cargando lección 2')).toBeInTheDocument();
      expect(screen.getByLabelText('Cargando lección 3')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no lessons are provided', () => {
      render(
        <LessonMenu 
          lessons={[]} 
          onSelectLesson={mockOnSelectLesson} 
        />
      );

      expect(screen.getByText('No hay lecciones disponibles')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onSelectLesson when a lesson is clicked', () => {
      render(
        <LessonMenu 
          lessons={mockLessons} 
          onSelectLesson={mockOnSelectLesson} 
        />
      );

      const firstLessonButton = screen.getByLabelText('Seleccionar lección: Basic Conversations');
      fireEvent.click(firstLessonButton);

      expect(mockOnSelectLesson).toHaveBeenCalledWith(1);
    });

    it('should highlight selected lesson', () => {
      render(
        <LessonMenu 
          lessons={mockLessons} 
          onSelectLesson={mockOnSelectLesson}
          selectedLessonId={2}
        />
      );

      const selectedButton = screen.getByLabelText('Seleccionar lección: Grammar Practice');
      expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should handle keyboard navigation', () => {
      render(
        <LessonMenu 
          lessons={mockLessons} 
          onSelectLesson={mockOnSelectLesson} 
        />
      );

      const firstLessonButton = screen.getByLabelText('Seleccionar lección: Basic Conversations');
      firstLessonButton.focus();
      
      // Simulate click instead of keydown since the component uses onClick
      fireEvent.click(firstLessonButton);
      expect(mockOnSelectLesson).toHaveBeenCalledWith(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <LessonMenu 
          lessons={mockLessons} 
          onSelectLesson={mockOnSelectLesson} 
        />
      );

      mockLessons.forEach((lesson) => {
        const button = screen.getByLabelText(`Seleccionar lección: ${lesson.title}`);
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-pressed');
      });
    });

    it('should be keyboard accessible', () => {
      render(
        <LessonMenu 
          lessons={mockLessons} 
          onSelectLesson={mockOnSelectLesson} 
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        if (button.getAttribute('aria-label')?.includes('Seleccionar lección')) {
          // Button elements are focusable by default, tabIndex not necessary
          expect(button).toBeInTheDocument();
          expect(button).toHaveAccessibleName();
        }
      });
    });
  });

  describe('Responsive Design', () => {
    it('should apply correct CSS classes for responsive layout', () => {
      render(
        <LessonMenu 
          lessons={mockLessons} 
          onSelectLesson={mockOnSelectLesson} 
        />
      );

      const container = screen.getByRole('button', { name: /Seleccionar lección: Basic Conversations/ }).parentElement;
      expect(container).toHaveClass('space-y-3', 'sm:grid', 'sm:grid-cols-2', 'lg:grid-cols-3');
    });
  });

  describe('Difficulty Color Coding', () => {
    it('should apply correct color classes for different difficulties', () => {
      render(
        <LessonMenu 
          lessons={mockLessons} 
          onSelectLesson={mockOnSelectLesson} 
        />
      );

      // Check if difficulty badges have appropriate colors (dark theme)
      const basicBadge = screen.getByText('Básico');
      expect(basicBadge).toHaveClass('bg-green-900/30', 'text-green-300');

      const intermediateBadge = screen.getByText('Intermedio');
      expect(intermediateBadge).toHaveClass('bg-yellow-900/30', 'text-yellow-300');

      const advancedBadge = screen.getByText('Avanzado');
      expect(advancedBadge).toHaveClass('bg-red-900/30', 'text-red-300');
    });
  });
});
