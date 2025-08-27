import { GET } from '../quiz/route';
import { NextRequest } from 'next/server';

// Setup test environment
Object.defineProperty(global, 'Request', {
  value: class Request {
    constructor(public url: string, public init?: RequestInit) {}
  },
  writable: true
});

Object.defineProperty(global, 'Response', {
  value: class Response {
    constructor(public body: unknown, public init?: ResponseInit) {}
    static json(data: unknown) {
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },
  writable: true
});

// Mock the lesson data
jest.mock('@/app/data/lesson1.json', () => ({
  id: 1,
  title: 'Basic Greetings',
  description: 'Learn basic greetings in English',
  difficulty: 'Beginner',
  questionsCount: 3,
  questions: [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'How do you say "hello" in English?',
      answer: 'Hello',
      options: ['Hello', 'Goodbye', 'Please', 'Thank you']
    },
    {
      id: 2,
      type: 'true-false',
      question: '"Good morning" is used in the evening',
      answer: false
    },
    {
      id: 3,
      type: 'fill-in-the-blank',
      question: 'Good _____, how are you?',
      answer: 'morning',
      synonyms: ['Morning']
    }
  ]
}), { virtual: true });

jest.mock('@/app/data/lesson2.json', () => ({
  id: 2,
  title: 'Numbers',
  description: 'Learn numbers in English',
  difficulty: 'Beginner',
  questionsCount: 2,
  questions: [
    {
      id: 4,
      type: 'multiple-choice',
      question: 'What is "one" in numbers?',
      answer: '1',
      options: ['1', '2', '3', '4']
    },
    {
      id: 5,
      type: 'translation',
      question: 'Translate: "two"',
      answer: 'dos',
      synonyms: ['2']
    }
  ]
}), { virtual: true });

jest.mock('@/app/data/lesson3.json', () => ({
  id: 3,
  title: 'Colors',
  description: 'Learn colors in English',
  difficulty: 'Beginner',
  questionsCount: 1,
  questions: [
    {
      id: 6,
      type: 'multiple-choice',
      question: 'What color is the sky?',
      answer: 'Blue',
      options: ['Red', 'Blue', 'Green', 'Yellow']
    }
  ]
}), { virtual: true });

// Mock the utility functions
jest.mock('@/app/lib/utils', () => ({
  validateQuestions: jest.fn().mockReturnValue(true),
  shuffleArray: jest.fn().mockImplementation((arr) => [...arr])
}));

describe('/api/quiz Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all questions when no lessonId is provided', async () => {
    const request = new NextRequest('http://localhost:3000/api/quiz');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(6); // 3 + 2 + 1 questions from all lessons
    
    // Verify the structure of the first question
    if (data.length > 0) {
      const question = data[0];
      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('type');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('answer');
    }
  });

  it('should return specific lesson questions when valid lessonId is provided', async () => {
    const request = new NextRequest('http://localhost:3000/api/quiz?lessonId=1');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('title', 'Basic Greetings');
    expect(data).toHaveProperty('questions');
    expect(Array.isArray(data.questions)).toBe(true);
    expect(data.questions).toHaveLength(3);
  });

  it('should handle invalid lessonId parameter (non-numeric)', async () => {
    const request = new NextRequest('http://localhost:3000/api/quiz?lessonId=invalid');
    const response = await GET(request);
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Invalid lesson ID');
  });

  it('should handle invalid lessonId parameter (negative number)', async () => {
    const request = new NextRequest('http://localhost:3000/api/quiz?lessonId=-1');
    const response = await GET(request);
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Invalid lesson ID');
  });

  it('should handle invalid lessonId parameter (zero)', async () => {
    const request = new NextRequest('http://localhost:3000/api/quiz?lessonId=0');
    const response = await GET(request);
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Invalid lesson ID');
  });

  it('should handle non-existent lessonId', async () => {
    const request = new NextRequest('http://localhost:3000/api/quiz?lessonId=999');
    const response = await GET(request);
    
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Lesson 999 not found');
  });

  it('should handle lesson with invalid data structure', async () => {
    // Mock validateQuestions to return false for this test
    const utils = await import('@/app/lib/utils');
    const validateQuestionsSpy = jest.spyOn(utils, 'validateQuestions').mockReturnValueOnce(false);

    const request = new NextRequest('http://localhost:3000/api/quiz?lessonId=1');
    const response = await GET(request);
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Invalid questions data structure');
    
    validateQuestionsSpy.mockRestore();
  });

  it('should handle validateQuestions failure for all questions', async () => {
    // Mock validateQuestions to return false for this test
    const utils = await import('@/app/lib/utils');
    const validateQuestionsSpy = jest.spyOn(utils, 'validateQuestions').mockReturnValueOnce(false);

    const request = new NextRequest('http://localhost:3000/api/quiz');
    const response = await GET(request);
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Invalid questions data structure');
    
    validateQuestionsSpy.mockRestore();
  });

  it('should set proper cache headers for all questions endpoint', async () => {
    const request = new NextRequest('http://localhost:3000/api/quiz');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=300');
  });

  it('should call shuffleArray for all questions endpoint', async () => {
    const utils = await import('@/app/lib/utils');
    const shuffleArraySpy = jest.spyOn(utils, 'shuffleArray');
    
    const request = new NextRequest('http://localhost:3000/api/quiz');
    await GET(request);
    
    expect(shuffleArraySpy).toHaveBeenCalled();
    
    shuffleArraySpy.mockRestore();
  });

  it('should return lesson 2 data correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/quiz?lessonId=2');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('id', 2);
    expect(data).toHaveProperty('title', 'Numbers');
    expect(data.questions).toHaveLength(2);
  });

  it('should return lesson 3 data correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/quiz?lessonId=3');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('id', 3);
    expect(data).toHaveProperty('title', 'Colors');
    expect(data.questions).toHaveLength(1);
  });

  it('should handle edge case with very large lessonId', async () => {
    const request = new NextRequest('http://localhost:3000/api/quiz?lessonId=999999999');
    const response = await GET(request);
    
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Lesson 999999999 not found');
  });

  it('should handle decimal lessonId by converting to integer', async () => {
    const request = new NextRequest('http://localhost:3000/api/quiz?lessonId=1.5');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('id', 1); // Should convert 1.5 to 1
  });
});
