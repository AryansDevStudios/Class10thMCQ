export type Question = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type TestDoc = {
  id?: string;
  title: string;
  startAt: number; // ms epoch
  endAt: number;
  createdAt: number;
  questions: Question[];
};

export type Submission = {
  srNo: string;
  name: string;
  section: string;
  whatsapp?: string;
  optionOrder: Record<string, number[]>;
  answers: Record<string, number>; // qid -> shuffled index chosen
  tabSwitches: number;
  startedAt?: any;
  submittedAt?: any;
  autoSubmitted?: boolean;
  score?: number;
  correctCount?: number;
  wrongCount?: number;
  unansweredCount?: number;
};
