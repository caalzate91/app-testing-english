export type Question = {
  id: number;
  type: 'multiple-choice' | 'translation' | 'true-false' | 'fill-in-the-blank';
  question: string;
  options?: string[];
  answer: string | boolean;
  synonyms?: string[];
};
