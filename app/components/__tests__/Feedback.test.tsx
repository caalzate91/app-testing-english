import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Feedback from '../Feedback';

describe('Feedback', () => {
  it('should render correct feedback with success styles', () => {
    render(<Feedback message="¡Correcto! 🎉" isCorrect={true} />);
    
    const feedbackElement = screen.getByText('¡Correcto! 🎉');
    expect(feedbackElement).toBeInTheDocument();
    
    const container = feedbackElement.closest('[role="alert"]');
    expect(container).toHaveClass('bg-success-900/30');
    expect(container).toHaveClass('border-success-600/50');
    expect(container).toHaveClass('text-success-200');
  });

  it('should render incorrect feedback with error styles', () => {
    render(<Feedback message="Incorrecto. La respuesta correcta es: Paris" isCorrect={false} />);
    
    const feedbackElement = screen.getByText('Incorrecto. La respuesta correcta es: Paris');
    expect(feedbackElement).toBeInTheDocument();
    
    const container = feedbackElement.closest('[role="alert"]');
    expect(container).toHaveClass('bg-danger-900/30');
    expect(container).toHaveClass('border-danger-600/50');
    expect(container).toHaveClass('text-danger-200');
  });

  it('should display correct checkmark icon for correct answers', () => {
    render(<Feedback message="¡Excelente trabajo!" isCorrect={true} />);
    
    expect(screen.getByText('✓')).toBeInTheDocument();
    
    const iconContainer = screen.getByText('✓').closest('div');
    expect(iconContainer).toHaveClass('bg-success-600');
    expect(iconContainer).toHaveClass('border-success-500');
  });

  it('should display X icon for incorrect answers', () => {
    render(<Feedback message="Intenta de nuevo" isCorrect={false} />);
    
    expect(screen.getByText('✗')).toBeInTheDocument();
    
    const iconContainer = screen.getByText('✗').closest('div');
    expect(iconContainer).toHaveClass('bg-danger-600');
    expect(iconContainer).toHaveClass('border-danger-500');
  });

  it('should have proper accessibility attributes', () => {
    render(<Feedback message="¡Correcto! 🎉" isCorrect={true} />);
    
    const feedbackElement = screen.getByRole('alert');
    expect(feedbackElement).toHaveAttribute('aria-live', 'polite');
  });

  it('should apply custom className when provided', () => {
    render(<Feedback message="Test message" isCorrect={true} className="custom-class" />);
    
    const container = screen.getByRole('alert');
    expect(container).toHaveClass('custom-class');
  });

  it('should have animation class for smooth appearance', () => {
    render(<Feedback message="Test message" isCorrect={true} />);
    
    const container = screen.getByRole('alert');
    expect(container).toHaveClass('animate-slide-in');
  });

  it('should maintain consistent structure for both correct and incorrect feedback', () => {
    const { rerender } = render(<Feedback message="Correct message" isCorrect={true} />);
    
    // Check structure for correct feedback
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Correct message')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
    
    // Rerender with incorrect feedback
    rerender(<Feedback message="Incorrect message" isCorrect={false} />);
    
    // Check structure for incorrect feedback
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Incorrect message')).toBeInTheDocument();
    expect(screen.getByText('✗')).toBeInTheDocument();
  });

  it('should handle long messages properly', () => {
    const longMessage = 'Este es un mensaje muy largo que debería mostrarse correctamente sin problemas de formato o diseño, incluso cuando contiene mucho texto.';
    
    render(<Feedback message={longMessage} isCorrect={true} />);
    
    expect(screen.getByText(longMessage)).toBeInTheDocument();
    
    const messageElement = screen.getByText(longMessage);
    expect(messageElement).toHaveClass('font-bold', 'text-lg');
  });

  it('should handle empty message gracefully', () => {
    render(<Feedback message="" isCorrect={true} />);
    
    const container = screen.getByRole('alert');
    expect(container).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('should have proper backdrop blur and shadow effects', () => {
    render(<Feedback message="Test message" isCorrect={true} />);
    
    const container = screen.getByRole('alert');
    expect(container).toHaveClass('backdrop-blur-sm');
    expect(container).toHaveClass('shadow-xl');
  });
});
