/**
 * @jest-environment jsdom
 */
import { Question } from '@/app/types';

describe('Question Types', () => {
  it('should define correct question structure', () => {
    const question: Question = {
      id: 1,
      type: 'multiple-choice',
      question: 'Test question?',
      options: ['A', 'B', 'C', 'D'],
      answer: 'A',
    };

    expect(question.id).toBe(1);
    expect(question.type).toBe('multiple-choice');
    expect(question.question).toBe('Test question?');
    expect(question.options).toEqual(['A', 'B', 'C', 'D']);
    expect(question.answer).toBe('A');
  });

  it('should allow true-false questions', () => {
    const question: Question = {
      id: 2,
      type: 'true-false',
      question: 'This is true?',
      answer: true,
    };

    expect(question.type).toBe('true-false');
    expect(question.answer).toBe(true);
  });

  it('should allow fill-in-the-blank questions', () => {
    const question: Question = {
      id: 3,
      type: 'fill-in-the-blank',
      question: 'Complete: Hello ___',
      answer: 'world',
      synonyms: ['World'],
    };

    expect(question.type).toBe('fill-in-the-blank');
    expect(question.answer).toBe('world');
    expect(question.synonyms).toContain('World');
  });
});
