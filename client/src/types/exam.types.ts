export type ExamType = 'qcm' | 'open_ended' | 'coding' | 'mixed';
export type QuestionType = 'qcm' | 'open_ended' | 'coding';

export interface Exam {
  id: string;
  moduleId: string;
  title: string;
  type: ExamType;
  passingScore: number;
  maxAttempts: number;
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
}

export interface Question {
  id: string;
  examId: string;
  type: QuestionType;
  questionText: string;
  points: number;
  orderIndex: number;
  qcmOptions?: QcmOption[];
  codingExercise?: CodingExercise;
}

export interface QcmOption {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
}

export interface CodingExercise {
  id: string;
  questionId: string;
  language: string;
  starterCode?: string;
  solutionTemplate?: string;
  timeLimit: number;
  memoryLimit: number;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  score?: number;
  passed: boolean;
  startedAt: string;
  submittedAt?: string;
}
