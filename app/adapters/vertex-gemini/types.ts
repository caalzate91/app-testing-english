/**
 * Types and interfaces for Vertex AI Gemini adapter
 */

export interface QAResponse {
  readonly answer: string;
  readonly sources: readonly string[];
  readonly confidence?: number;
}

export interface GenerateOptions {
  readonly temperature?: number;
  readonly maxTokens?: number;
  readonly topP?: number;
  readonly topK?: number;
}

export interface ContextDocument {
  readonly id: string | number;
  readonly title: string;
  readonly content: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Port interface for Vertex AI Q&A adapter
 * This interface defines the contract for Q&A generation
 * decoupled from the specific SDK implementation
 */
export interface IVertexQAAdapter {
  /**
   * Generate an answer to a given prompt
   * @param prompt The question or prompt to answer
   * @param options Optional generation parameters
   * @returns Promise with the generated answer
   */
  generateAnswer(prompt: string, options?: GenerateOptions): Promise<string>;

  /**
   * Generate a Q&A response grounded in JSON context documents
   * @param contextDocs Array of context documents from JSON data
   * @param question The user's question
   * @param options Optional generation parameters
   * @returns Promise with structured Q&A response including sources
   */
  qaFromJson(
    contextDocs: readonly ContextDocument[],
    question: string,
    options?: GenerateOptions
  ): Promise<QAResponse>;

  /**
   * Check if the adapter is properly configured
   * @returns true if the adapter can be used
   */
  isConfigured(): boolean;
}

export interface VertexAIConfig {
  readonly apiKey?: string | undefined;
  readonly projectId?: string | undefined;
  readonly location?: string | undefined;
  readonly model?: string | undefined;
}
