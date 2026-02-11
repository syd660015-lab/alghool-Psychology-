
export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface GamePair {
  id: string;
  term: string;
  description: string;
}

export interface QuickQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string; // New field for explanation
}

export interface LectureGame {
  title: string;
  instruction: string;
  pairs: GamePair[];
  quickQA?: QuickQuestion[];
}

export interface Lecture {
  id: number;
  title: string;
  objectives: string[];
  content: string;
  icon: string;
  glossary: GlossaryTerm[];
  game: LectureGame;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type ViewState = 'home' | 'lecture' | 'quiz' | 'chat';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
