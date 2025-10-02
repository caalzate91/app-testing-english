# Vertex AI Gemini Integration - Developer Guide

This guide shows how to integrate the Vertex AI adapter into your application code.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Basic Integration](#basic-integration)
3. [API Route Integration](#api-route-integration)
4. [React Component Integration](#react-component-integration)
5. [Best Practices](#best-practices)
6. [Error Handling](#error-handling)

## Quick Start

### 1. Setup Environment

```bash
# Create .env.local file
cat > .env.local << EOF
GEMINI_API_KEY=your_api_key_here
USE_VERTEX_AI=true
EOF
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Test the Adapter

```bash
# Run adapter tests
npm test -- app/adapters/vertex-gemini/__tests__/

# Run example (requires API key)
npx tsx app/adapters/vertex-gemini/example.ts
```

## Basic Integration

### Simple Q&A

```typescript
import { VertexGeminiClient } from '@/app/adapters/vertex-gemini';

async function askQuestion(question: string): Promise<string> {
  const client = new VertexGeminiClient();
  
  if (!client.isConfigured()) {
    throw new Error('Vertex AI not configured');
  }
  
  return await client.generateAnswer(question);
}

// Usage
const answer = await askQuestion('What is a good listener?');
console.log(answer);
```

### Grounded Q&A with Lesson Data

```typescript
import { VertexGeminiClient, JsonRepository, QAResponse } from '@/app/adapters/vertex-gemini';

async function askAboutLesson(lessonId: number, question: string): Promise<QAResponse> {
  // Load lesson data
  const lesson = await JsonRepository.loadLesson(lessonId);
  
  // Convert to context documents
  const contextDocs = JsonRepository.lessonToContextDocuments(lesson);
  
  // Initialize client
  const client = new VertexGeminiClient();
  
  // Generate grounded response
  return await client.qaFromJson(contextDocs, question);
}

// Usage
const response = await askAboutLesson(1, 'What expressions are used for making friends?');
console.log(response.answer);
console.log(response.sources);
```

## API Route Integration

### Create Q&A API Endpoint

Create `app/api/ai-qa/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { VertexGeminiClient, JsonRepository, QAResponse } from '@/app/adapters/vertex-gemini';

interface QARequest {
  question: string;
  lessonId?: number;
}

export async function POST(request: NextRequest): Promise<NextResponse<QAResponse | { error: string }>> {
  try {
    // Check if feature is enabled
    if (process.env.USE_VERTEX_AI !== 'true') {
      return NextResponse.json(
        { error: 'AI Q&A feature is not enabled' },
        { status: 503 }
      );
    }
    
    // Parse request
    const body = await request.json() as QARequest;
    const { question, lessonId } = body;
    
    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }
    
    // Initialize client
    const client = new VertexGeminiClient();
    
    if (!client.isConfigured()) {
      return NextResponse.json(
        { error: 'AI service is not configured' },
        { status: 503 }
      );
    }
    
    // Load context data
    let contextDocs;
    if (lessonId) {
      const lesson = await JsonRepository.loadLesson(lessonId);
      contextDocs = JsonRepository.lessonToContextDocuments(lesson);
    } else {
      const allLessons = await JsonRepository.loadAllLessons();
      contextDocs = JsonRepository.lessonsToContextDocuments(allLessons);
    }
    
    // Generate response
    const response = await client.qaFromJson(contextDocs, question, {
      temperature: 0.7,
      maxTokens: 512,
    });
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=300',
      },
    });
    
  } catch (error) {
    console.error('Error in AI Q&A API:', error);
    return NextResponse.json(
      { error: 'Failed to generate answer' },
      { status: 500 }
    );
  }
}
```

### Client-side Usage

```typescript
async function askAIQuestion(question: string, lessonId?: number) {
  const response = await fetch('/api/ai-qa', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, lessonId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to get AI response');
  }
  
  return await response.json();
}
```

## React Component Integration

### AI Help Component

```typescript
'use client';

import { useState } from 'react';
import { QAResponse } from '@/app/adapters/vertex-gemini';

interface AIHelpProps {
  lessonId?: number;
}

export function AIHelp({ lessonId }: AIHelpProps) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<QAResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/ai-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, lessonId }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await res.json() as QAResponse;
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="ai-help">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask me anything about this lesson..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !question.trim()}>
          {loading ? 'Thinking...' : 'Ask AI'}
        </button>
      </form>
      
      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}
      
      {response && (
        <div className="response">
          <h3>Answer:</h3>
          <p>{response.answer}</p>
          {response.sources.length > 0 && (
            <div className="sources">
              <strong>Sources:</strong> {response.sources.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### Usage in Page

```typescript
import { AIHelp } from '@/app/components/AIHelp';

export default function LessonPage({ params }: { params: { lessonId: string } }) {
  return (
    <div>
      {/* Your lesson content */}
      
      {/* AI Help Section */}
      <section className="ai-help-section">
        <h2>Need Help?</h2>
        <AIHelp lessonId={parseInt(params.lessonId)} />
      </section>
    </div>
  );
}
```

## Best Practices

### 1. Configuration Check

Always check if the adapter is configured before using it:

```typescript
const client = new VertexGeminiClient();

if (!client.isConfigured()) {
  // Handle unconfigured state
  return <div>AI features are not available</div>;
}
```

### 2. Error Boundaries

Wrap AI components in error boundaries:

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div>
      <h2>AI Service Unavailable</h2>
      <p>{error.message}</p>
    </div>
  );
}

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <AIHelp lessonId={1} />
</ErrorBoundary>
```

### 3. Loading States

Provide clear loading indicators:

```typescript
{loading && (
  <div className="loading">
    <Spinner />
    <span>Generating answer...</span>
  </div>
)}
```

### 4. Rate Limiting

Implement client-side debouncing:

```typescript
import { useDebouncedCallback } from 'use-debounce';

const debouncedAsk = useDebouncedCallback(
  async (question: string) => {
    const response = await askAIQuestion(question);
    setResponse(response);
  },
  500 // Wait 500ms after user stops typing
);
```

### 5. Context Filtering

Filter context to reduce token usage:

```typescript
// Filter by question type
const multipleChoiceDocs = JsonRepository.filterByQuestionType(
  contextDocs,
  'multiple-choice'
);

// Use filtered context
const response = await client.qaFromJson(
  multipleChoiceDocs,
  'What are the multiple-choice questions about?'
);
```

### 6. Caching

Cache responses to reduce API calls:

```typescript
const responseCache = new Map<string, QAResponse>();

async function getCachedResponse(question: string, lessonId: number): Promise<QAResponse> {
  const cacheKey = `${lessonId}-${question}`;
  
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey)!;
  }
  
  const response = await askAboutLesson(lessonId, question);
  responseCache.set(cacheKey, response);
  
  return response;
}
```

## Error Handling

### Handle Different Error Types

```typescript
try {
  const response = await client.qaFromJson(contextDocs, question);
  return response;
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes('not configured')) {
      // Handle configuration error
      return { error: 'AI service is not set up' };
    }
    
    if (error.message.includes('Failed to generate')) {
      // Handle generation error
      return { error: 'Could not generate answer. Please try again.' };
    }
    
    if (error.message.includes('No context documents')) {
      // Handle empty context
      return { error: 'No lesson data available' };
    }
  }
  
  // Generic error
  console.error('Unexpected error:', error);
  return { error: 'An unexpected error occurred' };
}
```

### Retry Logic

```typescript
async function generateWithRetry(
  client: VertexGeminiClient,
  contextDocs: ContextDocument[],
  question: string,
  maxRetries = 3
): Promise<QAResponse> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await client.qaFromJson(contextDocs, question);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }
  
  throw lastError || new Error('Failed after retries');
}
```

## Next Steps

1. **Implement API Route**: Create the Q&A endpoint in your API routes
2. **Add UI Components**: Build React components for user interaction
3. **Test Integration**: Verify the integration with real API calls
4. **Monitor Usage**: Track API usage and costs
5. **Optimize**: Fine-tune prompts and context filtering

## Resources

- [Full API Reference](./VERTEX_AI_ADAPTER.md)
- [Architecture Decision Record](./ADR_VERTEX_AI_INTEGRATION.md)
- [Example Code](./app/adapters/vertex-gemini/example.ts)
- [Test Examples](./app/adapters/vertex-gemini/__tests__/)
