import { NextRequest, NextResponse } from 'next/server';
import { Question } from '@/app/types';
import { Lesson } from '@/app/lib/data/lesson-repository';
import { validateQuestions, shuffleArray } from '@/app/lib/utils';

// Importar datos de lecciones
import lesson1Data from '@/app/data/lesson1.json';
import lesson2Data from '@/app/data/lesson2.json';
import lesson3Data from '@/app/data/lesson3.json';

// Mapa de lecciones para acceso directo
const lessonsData: Record<number, Lesson> = {
  1: lesson1Data as Lesson,
  2: lesson2Data as Lesson,
  3: lesson3Data as Lesson,
};

export async function GET(request: NextRequest): Promise<NextResponse<Lesson | Question[] | { error: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const lessonIdParam = searchParams.get('lessonId');
    
    // Si no se especifica lección, devolver todas las preguntas de todas las lecciones (comportamiento legacy)
    if (!lessonIdParam) {
      const allQuestions: Question[] = [];
      Object.values(lessonsData).forEach(lesson => {
        allQuestions.push(...lesson.questions);
      });

      // Validate questions data integrity
      if (!validateQuestions(allQuestions)) {
        console.error('Invalid questions data structure detected');
        return NextResponse.json(
          { error: 'Invalid questions data structure' },
          { status: 500 }
        );
      }

      // Shuffle questions to make it more interesting
      const shuffledQuestions = shuffleArray(allQuestions);
      
      return NextResponse.json(shuffledQuestions, {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        },
      });
    }

    // Validar y parsear lessonId
    const lessonId = parseInt(lessonIdParam, 10);
    if (isNaN(lessonId) || lessonId < 1) {
      return NextResponse.json(
        { error: 'Invalid lesson ID. Must be a positive number.' },
        { status: 400 }
      );
    }

    // Verificar si la lección existe
    const lesson = lessonsData[lessonId];
    if (!lesson) {
      return NextResponse.json(
        { error: `Lesson ${lessonId} not found` },
        { status: 404 }
      );
    }

    // Validar que la lección tiene la estructura correcta
    if (!lesson.questions || !Array.isArray(lesson.questions)) {
      console.error(`Invalid lesson data structure for lesson ${lessonId}`);
      return NextResponse.json(
        { error: 'Invalid lesson data structure' },
        { status: 500 }
      );
    }

    // Validate questions data integrity
    if (!validateQuestions(lesson.questions)) {
      console.error(`Invalid questions data structure in lesson ${lessonId}`);
      return NextResponse.json(
        { error: 'Invalid questions data structure' },
        { status: 500 }
      );
    }

    // Shuffle questions to make it more interesting
    const shuffledQuestions = shuffleArray(lesson.questions);
    const lessonWithShuffledQuestions: Lesson = {
      ...lesson,
      questions: shuffledQuestions,
    };
    
    return NextResponse.json(lessonWithShuffledQuestions, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Error in quiz API:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Error desconocido al procesar las preguntas';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
