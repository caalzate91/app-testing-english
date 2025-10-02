# Vertex AI Gemini Adapter

This module provides integration with Google's Vertex AI Gemini 2.5 Flash model for generating Q&A responses grounded in the application's JSON lesson data.

## Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Installation](#installation)
- [Authentication Setup](#authentication-setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Overview

The Vertex AI Gemini Adapter enables the English learning application to:
- Generate AI-powered answers to questions about lesson content
- Ground responses in the existing JSON lesson data
- Provide contextual learning assistance

### Key Features

- **Decoupled Architecture**: Uses port/adapter pattern with `IVertexQAAdapter` interface
- **JSON Context Grounding**: Answers are based on actual lesson content
- **Configurable**: Support for temperature, token limits, and other generation parameters
- **Well-Tested**: 87.5% test coverage with comprehensive unit and integration tests
- **Feature Flag Support**: Optional integration via `USE_VERTEX_AI` environment variable

## Requirements

- **Node.js**: 18.x or higher
- **Google Generative AI API Key**: Required for API access
- **Google Cloud Project**: Optional, for Vertex AI deployment

## Installation

The adapter is already included in the project. Dependencies are installed via:

```bash
npm install
```

The main dependency is `@google/generative-ai` which provides the SDK for Google's Generative AI services.

## Authentication Setup

### Option 1: API Key (Recommended for Local Development)

1. **Get an API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create or select a project
   - Generate an API key

2. **Set Environment Variable**:
   ```bash
   # Create .env.local file (already in .gitignore)
   echo "GEMINI_API_KEY=your_api_key_here" > .env.local
   ```

3. **Verify Configuration**:
   ```bash
   # The adapter will log a warning if not configured
   npm run dev
   ```

### Option 2: Application Default Credentials (ADC)

For deployment to Google Cloud:

1. **Install Google Cloud CLI**:
   ```bash
   # macOS
   brew install google-cloud-sdk
   
   # Linux
   curl https://sdk.cloud.google.com | bash
   
   # Windows
   # Download from https://cloud.google.com/sdk/docs/install
   ```

2. **Authenticate**:
   ```bash
   gcloud auth application-default login
   ```

3. **Set Project**:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

## Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# Required: Google Generative AI API Key
GEMINI_API_KEY=your_api_key_here

# Optional: Vertex AI Configuration (for Google Cloud deployment)
VERTEX_PROJECT_ID=your_project_id
VERTEX_LOCATION=us-central1
VERTEX_MODEL=gemini-2.0-flash-exp

# Optional: Feature Flag
USE_VERTEX_AI=true
```

### Configuration Options

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | Yes | - | API key for Google Generative AI |
| `VERTEX_PROJECT_ID` | No | - | Google Cloud project ID |
| `VERTEX_LOCATION` | No | `us-central1` | Vertex AI service location |
| `VERTEX_MODEL` | No | `gemini-2.0-flash-exp` | Model name |
| `USE_VERTEX_AI` | No | `false` | Enable/disable adapter |

## Usage

### Basic Usage

```typescript
import { VertexGeminiClient, JsonRepository } from '@/app/adapters/vertex-gemini';

// Initialize the client
const client = new VertexGeminiClient();

// Check if configured
if (!client.isConfigured()) {
  console.error('Vertex AI client not configured');
  return;
}

// Generate a simple answer
const answer = await client.generateAnswer('What is a listener?');
console.log(answer);
```

### Q&A with JSON Context

```typescript
import { VertexGeminiClient, JsonRepository } from '@/app/adapters/vertex-gemini';

async function askQuestion(question: string) {
  // Load lesson data
  const lesson = await JsonRepository.loadLesson(1);
  
  // Convert to context documents
  const contextDocs = JsonRepository.lessonToContextDocuments(lesson);
  
  // Initialize client
  const client = new VertexGeminiClient();
  
  // Generate grounded Q&A response
  const response = await client.qaFromJson(contextDocs, question);
  
  console.log('Answer:', response.answer);
  console.log('Sources:', response.sources);
}

// Usage
await askQuestion('What expressions are used when making friends?');
```

### Advanced Usage with Options

```typescript
import { VertexGeminiClient, JsonRepository } from '@/app/adapters/vertex-gemini';

async function generateWithOptions() {
  const lessons = await JsonRepository.loadAllLessons();
  const contextDocs = JsonRepository.lessonsToContextDocuments(lessons);
  
  const client = new VertexGeminiClient();
  
  const response = await client.qaFromJson(
    contextDocs,
    'Summarize the key learning points',
    {
      temperature: 0.3,      // Lower = more focused
      maxTokens: 512,        // Limit response length
      topP: 0.9,            // Nucleus sampling
      topK: 40,             // Top-k sampling
    }
  );
  
  return response;
}
```

### Filtering Context

```typescript
import { JsonRepository } from '@/app/adapters/vertex-gemini';

// Load all lessons
const allLessons = await JsonRepository.loadAllLessons();
const allDocs = JsonRepository.lessonsToContextDocuments(allLessons);

// Filter by lesson ID
const lesson1Docs = JsonRepository.filterByLessonId(allDocs, 1);

// Filter by question type
const multipleChoiceDocs = JsonRepository.filterByQuestionType(
  allDocs,
  'multiple-choice'
);
```

## API Reference

### IVertexQAAdapter

Main interface for the adapter.

#### Methods

##### `generateAnswer(prompt: string, options?: GenerateOptions): Promise<string>`

Generate an answer to a prompt.

**Parameters:**
- `prompt`: The question or prompt
- `options`: Optional generation parameters

**Returns:** Promise with the generated answer string

##### `qaFromJson(contextDocs: ContextDocument[], question: string, options?: GenerateOptions): Promise<QAResponse>`

Generate a Q&A response grounded in JSON context.

**Parameters:**
- `contextDocs`: Array of context documents from JSON data
- `question`: User's question
- `options`: Optional generation parameters

**Returns:** Promise with `QAResponse` containing answer and sources

##### `isConfigured(): boolean`

Check if the adapter is properly configured.

**Returns:** `true` if configured and ready to use

### JsonRepository

Utility class for loading and managing JSON lesson data.

#### Static Methods

##### `loadLesson(lessonId: number): Promise<Lesson>`

Load a specific lesson by ID (1-11).

##### `loadAllLessons(): Promise<Lesson[]>`

Load all available lessons.

##### `lessonToContextDocuments(lesson: Lesson): ContextDocument[]`

Convert a lesson to context documents.

##### `lessonsToContextDocuments(lessons: Lesson[]): ContextDocument[]`

Convert multiple lessons to context documents.

##### `filterByLessonId(documents: ContextDocument[], lessonId: number): ContextDocument[]`

Filter documents by lesson ID.

##### `filterByQuestionType(documents: ContextDocument[], questionType: string): ContextDocument[]`

Filter documents by question type.

### Types

```typescript
interface QAResponse {
  answer: string;
  sources: string[];
  confidence?: number;
}

interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
}

interface ContextDocument {
  id: string | number;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
}
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Adapter Tests Only

```bash
npm test -- app/adapters/vertex-gemini/__tests__/
```

### Check Coverage

```bash
npm run test:coverage
```

Coverage targets:
- **Lines**: ≥80%
- **Functions**: ≥80%
- **Branches**: ≥80%
- **Statements**: ≥80%

Current adapter coverage: **87.5%** ✓

### Run Full Quality Check

```bash
npm run check
```

This runs linting, build, and tests with coverage.

## Troubleshooting

### Issue: "Vertex AI client is not configured"

**Cause**: Missing or invalid API key

**Solution**:
1. Verify `GEMINI_API_KEY` is set in `.env.local`
2. Check the API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Restart the development server after setting environment variables

```bash
# Check if environment variable is set
echo $GEMINI_API_KEY

# Restart server
npm run dev
```

### Issue: "Failed to load lesson X"

**Cause**: Invalid lesson ID or missing lesson file

**Solution**:
- Verify lesson files exist in `app/data/` (lesson1.json through lesson11.json)
- Use valid lesson IDs (1-11)
- Check file permissions

```bash
# List available lesson files
ls -la app/data/lesson*.json
```

### Issue: "Empty response from Vertex AI"

**Cause**: API rate limiting or service unavailable

**Solution**:
1. Check API quota and usage in Google Cloud Console
2. Implement retry logic with exponential backoff
3. Verify network connectivity

```typescript
// Add retry logic
async function generateWithRetry(prompt: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client.generateAnswer(prompt);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### Issue: Module resolution errors

**Cause**: TypeScript path aliases not working

**Solution**:
- Ensure `tsconfig.json` has correct paths configuration
- Use relative imports if path aliases fail
- Restart TypeScript language server in your IDE

### Issue: Test failures

**Cause**: Mock configuration or environment setup

**Solution**:
1. Clear Jest cache: `npx jest --clearCache`
2. Verify all environment variables are set
3. Check mock implementations in test files

```bash
# Clear cache and run tests
npx jest --clearCache
npm test
```

## Additional Resources

- [Google Generative AI Documentation](https://ai.google.dev/docs)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Gemini API Reference](https://ai.google.dev/api)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## Support

For issues or questions:
1. Check this documentation
2. Review the test files for usage examples
3. Open an issue in the repository

## License

This adapter is part of the English A2 Practice App and follows the same license as the main project.
