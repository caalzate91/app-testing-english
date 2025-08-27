import { GET } from '../lessons/route';

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

// Mock lesson index data
jest.mock('@/app/data/lessons-index.json', () => ({
  lessons: [
    {
      id: 1,
      title: 'Basic Greetings',
      description: 'Learn basic greetings in English',
      difficulty: 'Beginner',
      questionsCount: 3,
      estimatedTime: '5 minutes'
    },
    {
      id: 2,
      title: 'Numbers',
      description: 'Learn numbers in English',
      difficulty: 'Beginner',
      questionsCount: 2,
      estimatedTime: '3 minutes'
    },
    {
      id: 3,
      title: 'Colors',
      description: 'Learn colors in English',
      difficulty: 'Beginner',
      questionsCount: 1,
      estimatedTime: '2 minutes'
    }
  ]
}), { virtual: true });

describe('/api/lessons Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return lessons successfully', async () => {
    const response = await GET();
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('lessons');
    expect(Array.isArray(data.lessons)).toBe(true);
    expect(data.lessons).toHaveLength(3);
    
    // Verify the structure of the first lesson
    if (data.lessons.length > 0) {
      const lesson = data.lessons[0];
      expect(lesson).toHaveProperty('id');
      expect(lesson).toHaveProperty('title');
      expect(lesson).toHaveProperty('description');
      expect(lesson).toHaveProperty('difficulty');
      expect(lesson).toHaveProperty('questionsCount');
      expect(lesson).toHaveProperty('estimatedTime');
    }
  });

  it('should return correct lesson data structure', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(data.lessons[0]).toEqual({
      id: 1,
      title: 'Basic Greetings',
      description: 'Learn basic greetings in English',
      difficulty: 'Beginner',
      questionsCount: 3,
      estimatedTime: '5 minutes'
    });

    expect(data.lessons[1]).toEqual({
      id: 2,
      title: 'Numbers',
      description: 'Learn numbers in English',
      difficulty: 'Beginner',
      questionsCount: 2,
      estimatedTime: '3 minutes'
    });

    expect(data.lessons[2]).toEqual({
      id: 3,
      title: 'Colors',
      description: 'Learn colors in English',
      difficulty: 'Beginner',
      questionsCount: 1,
      estimatedTime: '2 minutes'
    });
  });

  it('should set proper cache headers', async () => {
    const response = await GET();
    
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600');
  });

  it('should handle invalid lessons data structure', async () => {
    // Mock invalid data for this test
    jest.doMock('@/app/data/lessons-index.json', () => ({
      // Missing lessons property
      invalidProperty: 'invalid'
    }), { virtual: true });

    // Re-import the route to use the new mock
    jest.resetModules();
    const { GET: newGET } = await import('../lessons/route');
    
    const response = await newGET();
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Invalid lessons data structure');
  });

  it('should handle lessons property that is not an array', async () => {
    // Mock invalid data for this test
    jest.doMock('@/app/data/lessons-index.json', () => ({
      lessons: 'not an array'
    }), { virtual: true });

    // Re-import the route to use the new mock
    jest.resetModules();
    const { GET: newGET } = await import('../lessons/route');
    
    const response = await newGET();
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Invalid lessons data structure');
  });

  it('should handle JSON parsing errors gracefully', async () => {
    // Mock a module that throws an error when imported
    jest.doMock('@/app/data/lessons-index.json', () => {
      throw new Error('JSON parsing error');
    }, { virtual: true });

    // Re-import the route to use the new mock
    jest.resetModules();
    const { GET: newGET } = await import('../lessons/route');
    
    const response = await newGET();
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('JSON parsing error');
  });

  it('should handle unknown errors gracefully', async () => {
    // Mock a module that throws a non-Error object
    jest.doMock('@/app/data/lessons-index.json', () => {
      throw new Error('String error');
    }, { virtual: true });

    // Re-import the route to use the new mock
    jest.resetModules();
    const { GET: newGET } = await import('../lessons/route');
    
    const response = await newGET();
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Error desconocido al cargar las lecciones');
  });

  it('should return empty lessons array when no lessons exist', async () => {
    // Mock empty lessons array
    jest.doMock('@/app/data/lessons-index.json', () => ({
      lessons: []
    }), { virtual: true });

    // Re-import the route to use the new mock
    jest.resetModules();
    const { GET: newGET } = await import('../lessons/route');
    
    const response = await newGET();
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('lessons');
    expect(Array.isArray(data.lessons)).toBe(true);
    expect(data.lessons).toHaveLength(0);
  });

  it('should handle single lesson correctly', async () => {
    // Mock single lesson
    jest.doMock('@/app/data/lessons-index.json', () => ({
      lessons: [
        {
          id: 1,
          title: 'Single Lesson',
          description: 'Only one lesson available',
          difficulty: 'Beginner',
          questionsCount: 1,
          estimatedTime: '1 minute'
        }
      ]
    }), { virtual: true });

    // Re-import the route to use the new mock
    jest.resetModules();
    const { GET: newGET } = await import('../lessons/route');
    
    const response = await newGET();
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.lessons).toHaveLength(1);
    expect(data.lessons[0]).toEqual({
      id: 1,
      title: 'Single Lesson',
      description: 'Only one lesson available',
      difficulty: 'Beginner',
      questionsCount: 1,
      estimatedTime: '1 minute'
    });
  });
});
