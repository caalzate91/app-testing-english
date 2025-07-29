import { Question } from '@/app/types';

/**
 * Validates if the provided data matches the Question interface structure
 */
export function validateQuestion(data: unknown): data is Question {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const question = data as Record<string, unknown>;

  // Check required fields
  if (
    typeof question.id !== 'number' ||
    typeof question.question !== 'string' ||
    typeof question.type !== 'string' ||
    (typeof question.answer !== 'string' && typeof question.answer !== 'boolean')
  ) {
    return false;
  }

  // Validate question type enum
  const validTypes = ['multiple-choice', 'translation', 'true-false', 'fill-in-the-blank'] as const;
  if (!validTypes.includes(question.type as typeof validTypes[number])) {
    return false;
  }

  // Check optional fields
  if (question.options !== undefined && !Array.isArray(question.options)) {
    return false;
  }

  if (question.synonyms !== undefined && !Array.isArray(question.synonyms)) {
    return false;
  }

  if (question.explanation !== undefined && typeof question.explanation !== 'string') {
    return false;
  }

  return true;
}

/**
 * Validates an array of questions
 */
export function validateQuestions(data: unknown): data is Question[] {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(item => validateQuestion(item));
}

/**
 * Type guard to ensure a value is not null or undefined
 */
export function isNotNullish<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Safely parses JSON with proper error handling
 */
export function safeParse<T>(jsonString: string): { success: true; data: T } | { success: false; error: string } {
  try {
    const parsed = JSON.parse(jsonString) as T;
    return { success: true, data: parsed };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
    return { success: false, error: errorMessage };
  }
}

/**
 * Debounce utility for input handling
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | undefined;
  
  return (...args: Parameters<T>) => {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Clamps a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Formats a percentage with proper rounding
 */
export function formatPercentage(value: number, total: number): number {
  if (total === 0) {
    return 0;
  }
  return Math.round((value / total) * 100);
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    const swapValue = result[j];
    if (temp !== undefined && swapValue !== undefined) {
      result[i] = swapValue;
      result[j] = temp;
    }
  }
  return result;
}
