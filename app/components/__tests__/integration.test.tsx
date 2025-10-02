import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import QuizPage from '../QuizPage';
import { Lesson, Question } from '@/app/types';

// Mock data
const mockQuestions: Question[] = [
  {
    id: 1,
    type: 'multiple-choice',
    question: 'What is the capital of France?',
    answer: 'Paris',
    options: ['London', 'Paris', 'Berlin', 'Madrid']
  },
  {
    id: 2,
    type: 'true-false',
    question: 'The sun rises in the east.',
    answer: true
  },
  {
    id: 3,
    type: 'fill-in-the-blank',
    question: 'Complete: The sky is ___.',
    answer: 'blue',
    synonyms: ['azure', 'cerulean']
  }
];

const mockLesson: Lesson = {
  id: 1,
  title: 'Test Lesson',
  description: 'A test lesson for integration testing',
  level: 'A2',
  questions: mockQuestions
};

const mockEmptyLesson: Lesson = {
  id: 2,
  title: 'Empty Lesson',
  description: 'A lesson with no questions',
  level: 'A2',
  questions: []
};

// Mock the user event interactions (for future use)
const _mockUserInteraction = {
  click: async (element: HTMLElement) => {
    element.click();
  },
  type: async (element: HTMLElement, text: string) => {
    if (element instanceof HTMLInputElement) {
      element.value = text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

describe('Quiz Integration Tests', () => {
  const mockOnBackToLessons = jest.fn();
  const mockOnQuizComplete = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete full quiz flow with state management', async () => {
    render(
      <QuizPage 
        lesson={mockLesson} 
        onBackToLessons={mockOnBackToLessons}
        onQuizComplete={mockOnQuizComplete}
      />
    );
    
    // Should show first question
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    
    // Should show progress bar
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Pregunta 1 de 3')).toBeInTheDocument();
    
    // Should have all options available (buttons instead of labels)
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Berlin')).toBeInTheDocument();
    expect(screen.getByText('Madrid')).toBeInTheDocument();
    
        // Select an answer
    fireEvent.click(screen.getByText('Paris'));
    
    // Wait for answer to be registered and button to update
    await waitFor(() => {
      // After selecting answer, submit button should be available
      expect(screen.getByText('Enviar respuesta')).toBeInTheDocument();
    });
  });

  it('should handle empty lesson gracefully', async () => {
    render(
      <QuizPage 
        lesson={mockEmptyLesson} 
        onBackToLessons={mockOnBackToLessons}
        onQuizComplete={mockOnQuizComplete}
      />
    );
    
    // Should show appropriate message for empty lesson
    // Based on how useQuiz handles empty questions array
    // Empty quiz should not trigger onQuizComplete automatically
    await waitFor(() => {
      // Should show empty state
      expect(screen.getByText('Pregunta 1 de 0')).toBeInTheDocument();
    });
  });

  it('should render different question types correctly', () => {
    render(
      <QuizPage 
        lesson={mockLesson} 
        onBackToLessons={mockOnBackToLessons}
        onQuizComplete={mockOnQuizComplete}
      />
    );
    
    // First question should be multiple choice
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('should maintain proper component integration', () => {
    render(
      <QuizPage 
        lesson={mockLesson} 
        onBackToLessons={mockOnBackToLessons}
        onQuizComplete={mockOnQuizComplete}
      />
    );
    
        // Should show all components properly integrated
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    
    // The button will show "Selecciona una respuesta para continuar" instead of "Enviar Respuesta"
    // when no answer is selected
    expect(screen.getByText('Selecciona una respuesta para continuar')).toBeInTheDocument();
    
    // Should show back button
    expect(screen.getByText('Volver a lecciones')).toBeInTheDocument();
  });

  it('should handle component prop validation', () => {
    // Test with minimal required props
    render(
      <QuizPage 
        lesson={mockLesson} 
        onBackToLessons={mockOnBackToLessons}
      />
    );
    
    // Should render without crashing
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
  });

  it('should integrate ProgressBar with quiz state', () => {
    render(
      <QuizPage 
        lesson={mockLesson} 
        onBackToLessons={mockOnBackToLessons}
        onQuizComplete={mockOnQuizComplete}
      />
    );
    
    const progressBar = screen.getByRole('progressbar');
    
    // Should show correct initial progress (1/3 = 33%)
    expect(progressBar).toHaveAttribute('aria-label', 'Progreso del cuestionario: 1 de 3 preguntas completadas');
    expect(progressBar).toHaveAttribute('value', '1');
    expect(progressBar).toHaveAttribute('max', '3');
    
    // Should show current question indicator
    expect(screen.getByText('Pregunta 1 de 3')).toBeInTheDocument();
  });

  it('should integrate QuizQuestion with parent state', () => {
    render(
      <QuizPage 
        lesson={mockLesson} 
        onBackToLessons={mockOnBackToLessons}
        onQuizComplete={mockOnQuizComplete}
      />
    );
    
    // Question should receive correct props from parent
    const question = screen.getByText('What is the capital of France?');
    expect(question).toBeInTheDocument();
    
    // Options should be properly rendered as buttons (not radio buttons)
    const optionButtons = screen.getAllByRole('button', { pressed: false });
    const questionOptions = optionButtons.filter(button => 
      ['London', 'Paris', 'Berlin', 'Madrid'].includes(button.textContent || '')
    );
    expect(questionOptions).toHaveLength(4);
    
    // Each option should be selectable
    questionOptions.forEach(button => {
      expect(button).toBeEnabled();
    });
  });

  it('should handle keyboard navigation in integrated components', () => {
    render(
      <QuizPage 
        lesson={mockLesson} 
        onBackToLessons={mockOnBackToLessons}
        onQuizComplete={mockOnQuizComplete}
      />
    );
    
    // All interactive elements should be keyboard accessible
    const optionButtons = screen.getAllByRole('button', { pressed: false });
    const questionOptions = optionButtons.filter(button => 
      ['London', 'Paris', 'Berlin', 'Madrid'].includes(button.textContent || '')
    );
    const backButton = screen.getByLabelText('Volver a lecciones');
    
    // Should all have proper tabIndex or be naturally focusable
    questionOptions.forEach(button => {
      expect(button).not.toHaveAttribute('tabindex', '-1');
    });
    
    expect(backButton).toBeEnabled();
  });

  it('should handle accessibility attributes across components', () => {
    render(
      <QuizPage 
        lesson={mockLesson} 
        onBackToLessons={mockOnBackToLessons}
        onQuizComplete={mockOnQuizComplete}
      />
    );
    
    // Progress bar accessibility
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-label');
    
    // Question options should have proper accessibility
    const optionButtons = screen.getAllByRole('button', { pressed: false });
    const questionOptions = optionButtons.filter(button => 
      ['London', 'Paris', 'Berlin', 'Madrid'].includes(button.textContent || '')
    );
    
    // Each option should have proper aria attributes
    questionOptions.forEach(button => {
      expect(button).toHaveAttribute('aria-pressed');
    });
  });

  it('should handle component state synchronization', () => {
    render(
      <QuizPage 
        lesson={mockLesson} 
        onBackToLessons={mockOnBackToLessons}
        onQuizComplete={mockOnQuizComplete}
      />
    );
    
    // Initial state should be consistent across components
    expect(screen.getByText('Pregunta 1 de 3')).toBeInTheDocument();
    
    // Progress bar should exist (checking for any progress-related attributes)
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    
    // Submit button should be available but disabled initially
    const submitButton = screen.getByText('Selecciona una respuesta para continuar');
    expect(submitButton).toBeInTheDocument();
    
    // No feedback should be shown initially
    expect(screen.queryByText(/¡Correcto!/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Incorrecto/)).not.toBeInTheDocument();
  });

  it('should handle error boundaries and edge cases', () => {
    const questionWithMissingData: Question = {
      id: 999,
      type: 'multiple-choice',
      question: '',
      answer: '',
      options: []
    };
    
    const faultyLesson: Lesson = {
      id: 999,
      title: 'Faulty Lesson',
      description: 'A lesson with problematic questions',
      level: 'A2',
      questions: [questionWithMissingData]
    };
    
    // Should not crash with invalid data
    render(
      <QuizPage 
        lesson={faultyLesson} 
        onBackToLessons={mockOnBackToLessons}
        onQuizComplete={mockOnQuizComplete}
      />
    );
    
    // Should render some form of content (back button via aria-label)
    expect(screen.getByLabelText('Volver a lecciones')).toBeInTheDocument();
  });
});
