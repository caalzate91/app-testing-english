import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizQuestion from '../QuizQuestion';
import { Question } from '@/app/types';

describe('QuizQuestion', () => {
  const mockOnAnswerChange = jest.fn();
  const mockOnSubmit = jest.fn();
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render multiple choice question correctly', () => {
    const multipleChoiceQuestion: Question = {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the capital of France?',
      answer: 'Paris',
      options: ['London', 'Paris', 'Berlin', 'Madrid']
    };
    
    render(
      <QuizQuestion
        question={multipleChoiceQuestion}
        userAnswer=""
        onAnswerChange={mockOnAnswerChange}
        onSubmit={mockOnSubmit}
        isAnswerValid={false}
        feedback={null}
      />
    );
    
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    expect(screen.getByText('📝 Opción múltiple')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Berlin')).toBeInTheDocument();
    expect(screen.getByText('Madrid')).toBeInTheDocument();
  });

  it('should render true-false question correctly', () => {
    const trueFalseQuestion: Question = {
      id: 2,
      type: 'true-false',
      question: 'Paris is the capital of Germany',
      answer: false
    };
    
    render(
      <QuizQuestion
        question={trueFalseQuestion}
        userAnswer=""
        onAnswerChange={mockOnAnswerChange}
        onSubmit={mockOnSubmit}
        isAnswerValid={false}
        feedback={null}
      />
    );
    
    expect(screen.getByText('Paris is the capital of Germany')).toBeInTheDocument();
    expect(screen.getByText('⚖️ Verdadero o Falso')).toBeInTheDocument();
    expect(screen.getByText('✓ True')).toBeInTheDocument();
    expect(screen.getByText('✗ False')).toBeInTheDocument();
  });

  it('should render fill-in-the-blank question correctly', () => {
    const fillInBlankQuestion: Question = {
      id: 3,
      type: 'fill-in-the-blank',
      question: 'The sky ___ blue.',
      answer: 'is',
      synonyms: ['Is', 'is', "'s"]
    };
    
    render(
      <QuizQuestion
        question={fillInBlankQuestion}
        userAnswer=""
        onAnswerChange={mockOnAnswerChange}
        onSubmit={mockOnSubmit}
        isAnswerValid={false}
        feedback={null}
      />
    );
    
    expect(screen.getByText('The sky ___ blue.')).toBeInTheDocument();
    expect(screen.getByText('✏️ Completar')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Completa la oración...')).toBeInTheDocument();
  });

  it('should render translation question correctly', () => {
    const translationQuestion: Question = {
      id: 4,
      type: 'translation',
      question: 'Translate: How are you?',
      answer: '¿Cómo estás?',
      synonyms: ['¿Como estas?', '¿Cómo está usted?']
    };
    
    render(
      <QuizQuestion
        question={translationQuestion}
        userAnswer=""
        onAnswerChange={mockOnAnswerChange}
        onSubmit={mockOnSubmit}
        isAnswerValid={false}
        feedback={null}
      />
    );
    
    expect(screen.getByText('Translate: How are you?')).toBeInTheDocument();
    expect(screen.getByText('🔄 Traducción')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Escribe tu traducción aquí...')).toBeInTheDocument();
  });

  it('should call onAnswerChange when option is clicked in multiple choice', () => {
    const multipleChoiceQuestion: Question = {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the capital of France?',
      answer: 'Paris',
      options: ['London', 'Paris', 'Berlin', 'Madrid']
    };
    
    render(
      <QuizQuestion
        question={multipleChoiceQuestion}
        userAnswer=""
        onAnswerChange={mockOnAnswerChange}
        onSubmit={mockOnSubmit}
        isAnswerValid={false}
        feedback={null}
      />
    );
    
    fireEvent.click(screen.getByText('Paris'));
    expect(mockOnAnswerChange).toHaveBeenCalledWith('Paris');
  });

  it('should call onAnswerChange when true/false option is clicked', () => {
    const trueFalseQuestion: Question = {
      id: 2,
      type: 'true-false',
      question: 'Paris is the capital of Germany',
      answer: false
    };
    
    render(
      <QuizQuestion
        question={trueFalseQuestion}
        userAnswer=""
        onAnswerChange={mockOnAnswerChange}
        onSubmit={mockOnSubmit}
        isAnswerValid={false}
        feedback={null}
      />
    );
    
    fireEvent.click(screen.getByText('✗ False'));
    expect(mockOnAnswerChange).toHaveBeenCalledWith('false');
  });

  it('should call onAnswerChange when typing in text input', () => {
    const fillInBlankQuestion: Question = {
      id: 3,
      type: 'fill-in-the-blank',
      question: 'The sky ___ blue.',
      answer: 'is',
      synonyms: ['Is', 'is', "'s"]
    };
    
    render(
      <QuizQuestion
        question={fillInBlankQuestion}
        userAnswer=""
        onAnswerChange={mockOnAnswerChange}
        onSubmit={mockOnSubmit}
        isAnswerValid={false}
        feedback={null}
      />
    );
    
    const input = screen.getByPlaceholderText('Completa la oración...');
    fireEvent.change(input, { target: { value: 'is' } });
    expect(mockOnAnswerChange).toHaveBeenCalledWith('is');
  });

  it('should show the submit button as disabled when answer is not valid', () => {
    const multipleChoiceQuestion: Question = {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the capital of France?',
      answer: 'Paris',
      options: ['London', 'Paris', 'Berlin', 'Madrid']
    };
    
    render(
      <QuizQuestion
        question={multipleChoiceQuestion}
        userAnswer=""
        onAnswerChange={mockOnAnswerChange}
        onSubmit={mockOnSubmit}
        isAnswerValid={false}
        feedback={null}
      />
    );
    
    expect(screen.getByRole('button', { name: /respuesta requerida para continuar/i })).toBeDisabled();
  });

  it('should enable the submit button when answer is valid', () => {
    const multipleChoiceQuestion: Question = {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the capital of France?',
      answer: 'Paris',
      options: ['London', 'Paris', 'Berlin', 'Madrid']
    };
    
    render(
      <QuizQuestion
        question={multipleChoiceQuestion}
        userAnswer="Paris"
        onAnswerChange={mockOnAnswerChange}
        onSubmit={mockOnSubmit}
        isAnswerValid={true}
        feedback={null}
      />
    );
    
    expect(screen.getByRole('button', { name: /enviar respuesta/i })).not.toBeDisabled();
  });

  it('should call onSubmit when submit button is clicked', () => {
    const multipleChoiceQuestion: Question = {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the capital of France?',
      answer: 'Paris',
      options: ['London', 'Paris', 'Berlin', 'Madrid']
    };
    
    render(
      <QuizQuestion
        question={multipleChoiceQuestion}
        userAnswer="Paris"
        onAnswerChange={mockOnAnswerChange}
        onSubmit={mockOnSubmit}
        isAnswerValid={true}
        feedback={null}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /enviar respuesta/i }));
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('should handle keyboard submission with Enter key', () => {
    const fillInBlankQuestion: Question = {
      id: 3,
      type: 'fill-in-the-blank',
      question: 'The sky ___ blue.',
      answer: 'is',
      synonyms: ['Is', 'is', "'s"]
    };
    
    render(
      <QuizQuestion
        question={fillInBlankQuestion}
        userAnswer="is"
        onAnswerChange={mockOnAnswerChange}
        onSubmit={mockOnSubmit}
        isAnswerValid={true}
        feedback={null}
      />
    );
    
    const input = screen.getByPlaceholderText('Completa la oración...');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('should not show submit button when feedback is provided', () => {
    const multipleChoiceQuestion: Question = {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the capital of France?',
      answer: 'Paris',
      options: ['London', 'Paris', 'Berlin', 'Madrid']
    };
    
    render(
      <QuizQuestion
        question={multipleChoiceQuestion}
        userAnswer="Paris"
        onAnswerChange={mockOnAnswerChange}
        onSubmit={mockOnSubmit}
        isAnswerValid={true}
        feedback="¡Correcto! 🎉"
      />
    );
    
    expect(screen.queryByRole('button', { name: /enviar respuesta/i })).not.toBeInTheDocument();
  });

  it('should apply custom className when provided', () => {
    const multipleChoiceQuestion: Question = {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the capital of France?',
      answer: 'Paris',
      options: ['London', 'Paris', 'Berlin', 'Madrid']
    };
    
    render(
      <QuizQuestion
        question={multipleChoiceQuestion}
        userAnswer=""
        onAnswerChange={mockOnAnswerChange}
        onSubmit={mockOnSubmit}
        isAnswerValid={false}
        feedback={null}
        className="custom-class"
      />
    );
    
    const container = screen.getByText('What is the capital of France?').closest('.space-y-8');
    expect(container).toHaveClass('custom-class');
  });

  it('should handle onSubmit being undefined gracefully', () => {
    const multipleChoiceQuestion: Question = {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the capital of France?',
      answer: 'Paris',
      options: ['London', 'Paris', 'Berlin', 'Madrid']
    };
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <QuizQuestion
        question={multipleChoiceQuestion}
        userAnswer="Paris"
        onAnswerChange={mockOnAnswerChange}
        onSubmit={undefined as unknown as () => void}
        isAnswerValid={true}
        feedback={null}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /enviar respuesta/i }));
    expect(consoleSpy).toHaveBeenCalledWith('onSubmit is not a function:', undefined);
    
    consoleSpy.mockRestore();
  });

  it('should show selected state for multiple choice options', () => {
    const multipleChoiceQuestion: Question = {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the capital of France?',
      answer: 'Paris',
      options: ['London', 'Paris', 'Berlin', 'Madrid']
    };
    
    render(
      <QuizQuestion
        question={multipleChoiceQuestion}
        userAnswer="Paris"
        onAnswerChange={mockOnAnswerChange}
        onSubmit={mockOnSubmit}
        isAnswerValid={true}
        feedback={null}
      />
    );
    
    const parisButton = screen.getByText('Paris').closest('button');
    expect(parisButton).toHaveAttribute('aria-pressed', 'true');
    
    const londonButton = screen.getByText('London').closest('button');
    expect(londonButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('should show selected state for true/false options', () => {
    const trueFalseQuestion: Question = {
      id: 2,
      type: 'true-false',
      question: 'Paris is the capital of Germany',
      answer: false
    };
    
    render(
      <QuizQuestion
        question={trueFalseQuestion}
        userAnswer="false"
        onAnswerChange={mockOnAnswerChange}
        onSubmit={mockOnSubmit}
        isAnswerValid={true}
        feedback={null}
      />
    );
    
    const falseButton = screen.getByText('✗ False').closest('button');
    expect(falseButton).toHaveAttribute('aria-pressed', 'true');
    
    const trueButton = screen.getByText('✓ True').closest('button');
    expect(trueButton).toHaveAttribute('aria-pressed', 'false');
  });
});
