/**
 * Example usage of the Vertex AI Gemini Adapter
 * 
 * This file demonstrates how to use the adapter to generate Q&A responses
 * grounded in the lesson JSON data.
 * 
 * To run this example:
 * 1. Set GEMINI_API_KEY in .env.local
 * 2. Run: npx tsx app/adapters/vertex-gemini/example.ts
 */

/* eslint-disable no-console */

import { VertexGeminiClient, JsonRepository } from './index';

async function basicExample() {
  console.log('=== Basic Answer Generation ===\n');
  
  const client = new VertexGeminiClient();
  
  if (!client.isConfigured()) {
    console.error('❌ Vertex AI client is not configured.');
    console.error('Please set GEMINI_API_KEY in your .env.local file.\n');
    return;
  }
  
  try {
    const answer = await client.generateAnswer(
      'What does it mean to be a good listener in a conversation?'
    );
    console.log('Question: What does it mean to be a good listener in a conversation?');
    console.log('Answer:', answer);
    console.log('\n');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function groundedQAExample() {
  console.log('=== Grounded Q&A with Lesson Context ===\n');
  
  const client = new VertexGeminiClient();
  
  if (!client.isConfigured()) {
    console.error('❌ Vertex AI client is not configured.');
    return;
  }
  
  try {
    // Load lesson 1 (Making Friends)
    console.log('Loading Lesson 1: Making Friends...');
    const lesson = await JsonRepository.loadLesson(1);
    console.log(`✓ Loaded ${lesson.questions.length} questions\n`);
    
    // Convert to context documents
    const contextDocs = JsonRepository.lessonToContextDocuments(lesson);
    
    // Ask a question
    const question = 'What are some common expressions used when making friends?';
    console.log('Question:', question);
    console.log('\nGenerating answer based on lesson context...\n');
    
    const response = await client.qaFromJson(contextDocs, question);
    
    console.log('Answer:', response.answer);
    console.log('\nSources:', response.sources.join(', '));
    console.log('\n');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function multiLessonExample() {
  console.log('=== Multi-Lesson Q&A ===\n');
  
  const client = new VertexGeminiClient();
  
  if (!client.isConfigured()) {
    console.error('❌ Vertex AI client is not configured.');
    return;
  }
  
  try {
    // Load multiple lessons
    console.log('Loading all lessons...');
    const allLessons = await JsonRepository.loadAllLessons();
    console.log(`✓ Loaded ${allLessons.length} lessons\n`);
    
    // Convert to context documents
    const allDocs = JsonRepository.lessonsToContextDocuments(allLessons);
    console.log(`✓ Created ${allDocs.length} context documents\n`);
    
    // Filter for specific lesson
    const lesson1Docs = JsonRepository.filterByLessonId(allDocs, 1);
    console.log(`✓ Filtered to ${lesson1Docs.length} documents from Lesson 1\n`);
    
    // Ask a question
    const question = 'How do I start a conversation with someone new?';
    console.log('Question:', question);
    console.log('\nGenerating answer...\n');
    
    const response = await client.qaFromJson(lesson1Docs, question, {
      temperature: 0.7,
      maxTokens: 256,
    });
    
    console.log('Answer:', response.answer);
    console.log('\nSources:', response.sources.join(', '));
    console.log('\n');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function filterByTypeExample() {
  console.log('=== Filter by Question Type ===\n');
  
  const client = new VertexGeminiClient();
  
  if (!client.isConfigured()) {
    console.error('❌ Vertex AI client is not configured.');
    return;
  }
  
  try {
    // Load a lesson
    const lesson = await JsonRepository.loadLesson(1);
    const contextDocs = JsonRepository.lessonToContextDocuments(lesson);
    
    // Filter for multiple-choice questions
    const multipleChoiceDocs = JsonRepository.filterByQuestionType(
      contextDocs,
      'multiple-choice'
    );
    
    console.log(`Found ${multipleChoiceDocs.length} multiple-choice questions\n`);
    
    if (multipleChoiceDocs.length > 0) {
      const question = 'What are the multiple-choice options about making friends?';
      console.log('Question:', question);
      console.log('\nGenerating answer...\n');
      
      const response = await client.qaFromJson(multipleChoiceDocs, question);
      
      console.log('Answer:', response.answer);
      console.log('\n');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function main() {
  console.log('\n🤖 Vertex AI Gemini Adapter Examples\n');
  console.log('=====================================\n');
  
  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY) {
    console.log('⚠️  GEMINI_API_KEY not set in environment\n');
    console.log('To run these examples:');
    console.log('1. Create a .env.local file');
    console.log('2. Add: GEMINI_API_KEY=your_api_key_here');
    console.log('3. Get your API key from: https://makersuite.google.com/app/apikey\n');
    return;
  }
  
  // Run examples
  await basicExample();
  await groundedQAExample();
  await multiLessonExample();
  await filterByTypeExample();
  
  console.log('✅ Examples completed!\n');
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { basicExample, groundedQAExample, multiLessonExample, filterByTypeExample };
