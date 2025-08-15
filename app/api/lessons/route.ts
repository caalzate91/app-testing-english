import { NextResponse } from 'next/server';
import { LessonsIndex } from '@/app/lib/data/lesson-repository';
import lessonsIndexData from '@/app/data/lessons-index.json';

/**
 * GET /api/lessons
 * Devuelve la metadata de todas las lecciones disponibles
 */
export async function GET(): Promise<NextResponse<LessonsIndex | { error: string }>> {
  try {
    // Validar que los datos tienen la estructura correcta
    if (!lessonsIndexData.lessons || !Array.isArray(lessonsIndexData.lessons)) {
      console.error('Invalid lessons index data structure');
      return NextResponse.json(
        { error: 'Invalid lessons data structure' },
        { status: 500 }
      );
    }

    return NextResponse.json(lessonsIndexData as LessonsIndex, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error in lessons API:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Error desconocido al cargar las lecciones';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
