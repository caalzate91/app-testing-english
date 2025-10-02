/**
 * Vertex AI Gemini Adapter Module
 * 
 * This module provides an adapter for integrating Google's Vertex AI Gemini model
 * with the English learning application. It enables Q&A generation grounded in
 * the application's JSON lesson data.
 * 
 * Key Features:
 * - Decoupled interface (IVertexQAAdapter) for easy mocking and testing
 * - Support for Gemini 2.5 Flash model
 * - JSON context document grounding
 * - Configurable generation parameters
 * 
 * Usage:
 * ```typescript
 * import { VertexGeminiClient, JsonRepository } from '@/app/adapters/vertex-gemini';
 * 
 * const client = new VertexGeminiClient();
 * const lessons = await JsonRepository.loadAllLessons();
 * const contextDocs = JsonRepository.lessonsToContextDocuments(lessons);
 * 
 * const response = await client.qaFromJson(contextDocs, "What is a listener?");
 * console.log(response.answer);
 * console.log(response.sources);
 * ```
 * 
 * Environment Variables:
 * - GEMINI_API_KEY: API key for Google Generative AI (required)
 * - VERTEX_PROJECT_ID: Google Cloud project ID (optional)
 * - VERTEX_LOCATION: Vertex AI location (default: us-central1)
 * - VERTEX_MODEL: Model name (default: gemini-2.5-flash)
 * - USE_VERTEX_AI: Feature flag to enable/disable adapter (optional)
 */

export { VertexGeminiClient } from './VertexGeminiClient';
export { JsonRepository } from './JsonRepository';
export type {
  IVertexQAAdapter,
  QAResponse,
  GenerateOptions,
  ContextDocument,
  VertexAIConfig,
} from './types';
