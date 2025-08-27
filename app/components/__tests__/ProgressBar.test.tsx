import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  it('should render with correct progress percentage', () => {
    render(<ProgressBar current={3} total={6} />);
    
    expect(screen.getByText('Pregunta 3 de 6')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('should calculate correct percentage for different values', () => {
    const { rerender } = render(<ProgressBar current={1} total={4} />);
    
    expect(screen.getByText('25%')).toBeInTheDocument();
    
    rerender(<ProgressBar current={3} total={4} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should handle edge cases: 0% progress', () => {
    render(<ProgressBar current={0} total={10} />);
    
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('Pregunta 0 de 10')).toBeInTheDocument();
  });

  it('should handle edge cases: 100% progress', () => {
    render(<ProgressBar current={10} total={10} />);
    
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Pregunta 10 de 10')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes for accessibility', () => {
    render(<ProgressBar current={5} total={10} />);
    
    const progressElement = screen.getByRole('progressbar');
    expect(progressElement).toHaveAttribute('value', '5');
    expect(progressElement).toHaveAttribute('max', '10');
    expect(progressElement).toHaveAttribute('aria-label', 'Progreso del cuestionario: 5 de 10 preguntas completadas');
  });

  it('should render progress bar with gradient styles', () => {
    render(<ProgressBar current={6} total={10} />);
    
    const percentageText = screen.getByText('60%');
    expect(percentageText).toBeInTheDocument();
    
    // Check for the percentage span in the score section
    const percentageSpan = percentageText.closest('span');
    expect(percentageSpan).toHaveClass('text-primary-200', 'bg-primary-900/30', 'px-2', 'py-1', 'rounded-full', 'border', 'border-primary-700/50');
  });

  it('should handle decimal calculations correctly', () => {
    render(<ProgressBar current={1} total={3} />);
    
    // 1/3 = 0.333... which should round to 33%
    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('should handle large question numbers', () => {
    render(<ProgressBar current={90} total={100} />);
    
    expect(screen.getByText('Pregunta 90 de 100')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });

  it('should apply custom className when provided', () => {
    render(<ProgressBar current={5} total={10} className="custom-class" />);
    
    const container = screen.getByText('50%').closest('.space-y-2');
    expect(container).toHaveClass('custom-class');
  });
});
