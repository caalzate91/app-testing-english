import { render, screen, fireEvent } from '@testing-library/react';
import QuizResult from '../QuizResult';

// Mock window.location for home button test
const mockRestart = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  // Mock window.location.href
  Object.defineProperty(window, 'location', {
    value: {
      href: '',
    },
    writable: true,
  });
});

describe('QuizResult', () => {
  it('should render quiz completion message', () => {
    render(
      <QuizResult 
        correctAnswers={5} 
        totalQuestions={10} 
        onRestart={mockRestart} 
      />
    );

    expect(screen.getByText('¡Cuestionario Completado!')).toBeInTheDocument();
  });

  it('should display correct score percentage', () => {
    render(
      <QuizResult 
        correctAnswers={8} 
        totalQuestions={10} 
        onRestart={mockRestart} 
      />
    );

    // Should find multiple instances of 80% which is expected
    const percentages = screen.getAllByText('80%');
    expect(percentages.length).toBeGreaterThan(0);
  });

  it('should show correct number of correct and incorrect answers', () => {
    render(
      <QuizResult 
        correctAnswers={7} 
        totalQuestions={10} 
        onRestart={mockRestart} 
      />
    );

    expect(screen.getByText('7 de 10')).toBeInTheDocument();
    expect(screen.getByText('Respuestas incorrectas:')).toBeInTheDocument();
  });

  it('should display performance breakdown statistics', () => {
    render(
      <QuizResult 
        correctAnswers={6} 
        totalQuestions={10} 
        onRestart={mockRestart} 
      />
    );

    // Check that statistics containers exist
    expect(screen.getByText('Correctas')).toBeInTheDocument();
    expect(screen.getByText('Incorrectas')).toBeInTheDocument();
    expect(screen.getByText('Precisión')).toBeInTheDocument();
  });

  it('should call onRestart when retry button is clicked', () => {
    render(
      <QuizResult 
        correctAnswers={5} 
        totalQuestions={10} 
        onRestart={mockRestart} 
      />
    );

    const retryButton = screen.getByText('🔄 Intentar de nuevo');
    fireEvent.click(retryButton);
    
    expect(mockRestart).toHaveBeenCalledTimes(1);
  });

  it('should navigate to home when home button is clicked', () => {
    render(
      <QuizResult 
        correctAnswers={5} 
        totalQuestions={10} 
        onRestart={mockRestart} 
      />
    );

    const homeButton = screen.getByText('🏠 Inicio');
    fireEvent.click(homeButton);
    
    expect(window.location.href).toBe('/');
  });

  it('should show excellent performance message for high scores', () => {
    render(
      <QuizResult 
        correctAnswers={9} 
        totalQuestions={10} 
        onRestart={mockRestart} 
      />
    );

    expect(screen.getByText('¡Excelente trabajo!')).toBeInTheDocument();
    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  it('should show good performance message for medium scores', () => {
    render(
      <QuizResult 
        correctAnswers={7} 
        totalQuestions={10} 
        onRestart={mockRestart} 
      />
    );

    expect(screen.getByText('¡Buen intento!')).toBeInTheDocument();
    expect(screen.getByText('👍')).toBeInTheDocument();
  });

  it('should show encouragement message for low scores', () => {
    render(
      <QuizResult 
        correctAnswers={3} 
        totalQuestions={10} 
        onRestart={mockRestart} 
      />
    );

    expect(screen.getByText('Sigue practicando')).toBeInTheDocument();
    expect(screen.getByText('💪')).toBeInTheDocument();
  });

  it('should display progress bar with correct width', () => {
    render(
      <QuizResult 
        correctAnswers={7} 
        totalQuestions={10} 
        onRestart={mockRestart} 
      />
    );
    
    // Find the progress bar by looking for the style attribute
    const progressElements = screen.getAllByText(/\d+%/);
    expect(progressElements.length).toBeGreaterThan(0);
    
    // Find the visual progress bar 
    const progressBar = document.querySelector('div[style*="width: 70%"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should have proper button elements', () => {
    render(
      <QuizResult 
        correctAnswers={8} 
        totalQuestions={10} 
        onRestart={mockRestart} 
      />
    );
    
    const retryButton = screen.getByText('🔄 Intentar de nuevo');
    expect(retryButton).toBeInTheDocument();
    expect(retryButton.tagName).toBe('BUTTON');
    
    const homeButton = screen.getByText('🏠 Inicio');
    expect(homeButton).toBeInTheDocument();
    expect(homeButton.tagName).toBe('BUTTON');
  });

  it('should handle edge case with single question and correct answer', () => {
    render(
      <QuizResult 
        correctAnswers={1} 
        totalQuestions={1} 
        onRestart={mockRestart} 
      />
    );
    
    // Should find multiple instances of 100% which is expected
    const percentages = screen.getAllByText('100%');
    expect(percentages.length).toBeGreaterThan(0);
    expect(screen.getByText('1 de 1')).toBeInTheDocument();
    
    // Check statistics breakdown - get parent containers and verify numbers are displayed
    const correctsContainer = screen.getByText('Correctas').parentElement;
    expect(correctsContainer).toHaveTextContent('1');
    
    const incorrectsContainer = screen.getByText('Incorrectas').parentElement;
    expect(incorrectsContainer).toHaveTextContent('0');
  });

  it('should handle edge case with single question and incorrect answer', () => {
    render(
      <QuizResult 
        correctAnswers={0} 
        totalQuestions={1} 
        onRestart={mockRestart} 
      />
    );
    
    // Should find multiple instances of 0% which is expected
    const percentages = screen.getAllByText('0%');
    expect(percentages.length).toBeGreaterThan(0);
    expect(screen.getByText('0 de 1')).toBeInTheDocument();
    
    const correctsContainer = screen.getByText('Correctas').parentElement;
    expect(correctsContainer).toHaveTextContent('0');
    
    const incorrectsContainer = screen.getByText('Incorrectas').parentElement;
    expect(incorrectsContainer).toHaveTextContent('1');
  });

  it('should apply correct theme classes for excellent performance', () => {
    render(
      <QuizResult 
        correctAnswers={9} 
        totalQuestions={10} 
        onRestart={mockRestart} 
      />
    );
    
    // Check for success theme elements
    expect(screen.getByText('🎉')).toBeInTheDocument();
    expect(screen.getByText('¡Excelente trabajo!')).toBeInTheDocument();
    
    // Find progress bar with success gradient
    const progressBar = document.querySelector('div[class*="from-success-600"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should apply correct theme classes for good performance', () => {
    render(
      <QuizResult 
        correctAnswers={7} 
        totalQuestions={10} 
        onRestart={mockRestart} 
      />
    );
    
    // Check for warning theme elements
    expect(screen.getByText('👍')).toBeInTheDocument();
    expect(screen.getByText('¡Buen intento!')).toBeInTheDocument();
    
    // Find progress bar with warning gradient
    const progressBar = document.querySelector('div[class*="from-warning-600"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should apply correct theme classes for poor performance', () => {
    render(
      <QuizResult 
        correctAnswers={3} 
        totalQuestions={10} 
        onRestart={mockRestart} 
      />
    );
    
    // Check for danger theme elements  
    expect(screen.getByText('💪')).toBeInTheDocument();
    expect(screen.getByText('Sigue practicando')).toBeInTheDocument();
    
    // Find progress bar with danger gradient
    const progressBar = document.querySelector('div[class*="from-danger-600"]');
    expect(progressBar).toBeInTheDocument();
  });
});
