import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GenerativeModel } from '@google/generative-ai';
import {
  IVertexQAAdapter,
  QAResponse,
  GenerateOptions,
  ContextDocument,
  VertexAIConfig,
} from './types';

/**
 * Vertex AI Gemini client implementation
 * Implements the IVertexQAAdapter interface using Google's Generative AI SDK
 * Configured to use the gemini-2.5-flash model
 */
export class VertexGeminiClient implements IVertexQAAdapter {
  private readonly config: VertexAIConfig;
  private model: GenerativeModel | null = null;
  private genAI: GoogleGenerativeAI | null = null;

  constructor(config?: VertexAIConfig) {
    const apiKey = config?.apiKey ?? process.env.GEMINI_API_KEY;
    const projectId = config?.projectId ?? process.env.VERTEX_PROJECT_ID;
    const location = config?.location ?? process.env.VERTEX_LOCATION ?? 'us-central1';
    const model = config?.model ?? process.env.VERTEX_MODEL ?? 'gemini-2.0-flash-exp';

    this.config = {
      apiKey,
      projectId,
      location,
      model,
    };

    this.initialize();
  }

  /**
   * Initialize the Google Generative AI client
   */
  private initialize(): void {
    if (!this.config.apiKey) {
      console.warn('Vertex AI API key not configured. Set GEMINI_API_KEY environment variable.');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(this.config.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: this.config.model || 'gemini-2.0-flash-exp' });
    } catch (error) {
      console.error('Failed to initialize Vertex AI client:', error);
      throw new Error(`Vertex AI initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if the adapter is properly configured
   */
  isConfigured(): boolean {
    return this.model !== null && this.genAI !== null;
  }

  /**
   * Generate an answer to a given prompt
   */
  async generateAnswer(prompt: string, options?: GenerateOptions): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Vertex AI client is not configured. Please set GEMINI_API_KEY.');
    }

    if (!this.model) {
      throw new Error('Model not initialized');
    }

    try {
      const generationConfig = this.buildGenerationConfig(options);
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Empty response from Vertex AI');
      }

      return text;
    } catch (error) {
      console.error('Error generating answer:', error);
      throw new Error(`Failed to generate answer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a Q&A response grounded in JSON context documents
   */
  async qaFromJson(
    contextDocs: readonly ContextDocument[],
    question: string,
    options?: GenerateOptions
  ): Promise<QAResponse> {
    if (!this.isConfigured()) {
      throw new Error('Vertex AI client is not configured. Please set GEMINI_API_KEY.');
    }

    if (contextDocs.length === 0) {
      throw new Error('No context documents provided');
    }

    try {
      // Build the grounded prompt with context
      const prompt = this.buildGroundedPrompt(contextDocs, question);
      
      // Generate the answer
      const answer = await this.generateAnswer(prompt, options);
      
      // Extract sources from the context documents
      const sources = this.extractSources(contextDocs);
      
      return {
        answer,
        sources,
      };
    } catch (error) {
      console.error('Error in qaFromJson:', error);
      throw new Error(`Failed to generate Q&A response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Build a grounded prompt with context from JSON documents
   * @param contextDocs Array of context documents
   * @param question User's question
   * @returns Formatted prompt string
   */
  private buildGroundedPrompt(
    contextDocs: readonly ContextDocument[],
    question: string
  ): string {
    let prompt = 'You are an English language learning assistant. Answer the following question based ONLY on the provided context.\n\n';
    prompt += '=== CONTEXT ===\n';
    
    // Limit context to avoid token limits
    const maxDocs = 10;
    const docsToInclude = contextDocs.slice(0, maxDocs);
    
    docsToInclude.forEach((doc, index) => {
      prompt += `\nDocument ${index + 1}: ${doc.title}\n`;
      prompt += `${doc.content}\n`;
      prompt += '---\n';
    });
    
    if (contextDocs.length > maxDocs) {
      prompt += `\n(${contextDocs.length - maxDocs} additional documents omitted)\n`;
    }
    
    prompt += '\n=== QUESTION ===\n';
    prompt += `${question}\n\n`;
    prompt += '=== INSTRUCTIONS ===\n';
    prompt += 'Provide a clear, concise answer based on the context above. ';
    prompt += 'If the context does not contain enough information to answer the question, say so. ';
    prompt += 'Always reference which documents or lessons your answer is based on.\n';
    
    return prompt;
  }

  /**
   * Extract source references from context documents
   * @param contextDocs Array of context documents
   * @returns Array of source strings
   */
  private extractSources(contextDocs: readonly ContextDocument[]): readonly string[] {
    const sources = new Set<string>();
    
    contextDocs.forEach((doc) => {
      if (doc.metadata && doc.metadata.lessonTitle) {
        sources.add(String(doc.metadata.lessonTitle));
      } else {
        sources.add(doc.title);
      }
    });
    
    return Array.from(sources);
  }

  /**
   * Build generation configuration from options
   * @param options Optional generation parameters
   * @returns Generation config object
   */
  private buildGenerationConfig(options?: GenerateOptions): Record<string, unknown> {
    return {
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxTokens ?? 1024,
      topP: options?.topP ?? 0.95,
      topK: options?.topK ?? 40,
    };
  }
}
