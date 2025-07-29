export interface Question {
  readonly id: number;
  readonly type: 'multiple-choice' | 'translation' | 'true-false' | 'fill-in-the-blank';
  readonly question: string;
  readonly options?: readonly string[];
  readonly answer: string | boolean;
  readonly synonyms?: readonly string[];
  readonly explanation?: string;
}

export interface QuizState {
  readonly questions: readonly Question[];
  readonly currentQuestionIndex: number;
  readonly userAnswer: string;
  readonly score: number;
  readonly isCompleted: boolean;
  readonly feedback: string | null;
  readonly isCorrect: boolean;
}

export interface QuizResult {
  readonly score: number;
  readonly totalQuestions: number;
  readonly percentage: number;
  readonly passed: boolean;
  readonly completedAt: Date;
}

export interface QuizStatistics {
  readonly correctAnswers: number;
  readonly totalQuestions: number;
  readonly accuracy: number;
  readonly timeSpent?: number;
}

export interface Lesson {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly level: string;
  readonly questions: readonly Question[];
}

export interface LessonMetadata {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly level: string;
  readonly questionsCount: number;
  readonly difficulty: 'beginner' | 'intermediate' | 'advanced';
  readonly tags: readonly string[];
}

export type QuestionType = Question['type'];

export type AnswerValidationResult = {
  readonly isValid: boolean;
  readonly isCorrect: boolean;
  readonly feedback: string;
};
