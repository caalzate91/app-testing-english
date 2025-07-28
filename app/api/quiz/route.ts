import { NextResponse } from 'next/server';
import { Question } from '../../types';

const questions: Question[] = [
  // 5 Multiple Choice
  {
    id: 1,
    type: 'multiple-choice',
    question: "Which of these is a place you might go on the weekend?",
    options: ["Salary", "Club", "Listener", "Health"],
    answer: "Club",
    synonyms: ["Nightclub", "Bar"]
  },
  {
    id: 2,
    type: 'multiple-choice',
    question: "A person who loves cats and dogs is an ______.",
    options: ["Animal lover", "Football fan", "Talker", "Stranger"],
    answer: "Animal lover",
  },
  {
    id: 3,
    type: 'multiple-choice',
    question: "What do you call a person you don't know?",
    options: ["Pet", "Stranger", "Friend", "Talker"],
    answer: "Stranger",
    synonyms: ["Unknown person", "Newcomer"]
  },
  {
    id: 4,
    type: 'multiple-choice',
    question: "Which is an activity you do in your free time?",
    options: ["Salary", "Software company", "Play sports", "Full-time student"],
    answer: "Play sports",
    synonyms: ["Engage in athletics", "Do physical activities"]
  },
  {
    id: 5,
    type: 'multiple-choice',
    question: "'By the way, ...' is an expression used to:",
    options: ["End a conversation", "Introduce a new topic", "Disagree", "Say hello"],
    answer: "Introduce a new topic",
  },
  // 5 Translation (ES -> EN)
  {
    id: 6,
    type: 'translation',
    question: "Traduce: 'Me gusta conocer gente nueva.'",
    answer: "I like to meet new people",
  },
  {
    id: 7,
    type: 'translation',
    question: "Traduce: '¿Tienes un apodo?'",
    answer: "Do you have a nickname?",
  },
  {
    id: 8,
    type: 'translation',
    question: "Traduce: 'No soy un fan de los deportes.'",
    answer: "I'm not a sports fan",
  },
  {
    id: 9,
    type: 'translation',
    question: "Traduce: '¿Cómo llegas al trabajo?'",
    answer: "How do you get to work?",
  },
  {
    id: 10,
    type: 'translation',
    question: "Traduce: 'Suelo dormir hasta tarde los fines de semana.'",
    answer: "I usually sleep late on the weekends",
  },
  // 2 True/False
  {
    id: 11,
    type: 'true-false',
    question: "True or False: 'Chilly' means the weather is very hot.",
    answer: false,
  },
  {
    id: 12,
    type: 'true-false',
    question: "True or False: If you are 'allergic to' cats, you can have one as a pet without problems.",
    answer: false,
  },
  // 3 Fill in the blank
  {
    id: 13,
    type: 'fill-in-the-blank',
    question: "I don't have ______ to do, I'm free all day.",
    answer: "anything",
  },
  {
    id: 14,
    type: 'fill-in-the-blank',
    question: "She is a very ______ person, she loves to talk.",
    answer: "talkative",
  },
  {
    id: 15,
    type: 'fill-in-the-blank',
    question: "A: 'I'm broke.' B: 'I am ______.'",
    answer: "too",
  },
];

export async function GET() {
  // Shuffle questions to make it more interesting
  const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
  return NextResponse.json(shuffledQuestions);
}
