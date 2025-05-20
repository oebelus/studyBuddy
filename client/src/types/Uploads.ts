import { MCQ } from "./mcq";

export type QuestionUpload = {
  proposition: string;
  answers: string[];
  correct: number[];
};

export type QuestionsUpload = {
  questions: QuestionUpload[];
  module: string;
  session: string;
};

export const transformQuestions = (
  questions: QuestionUpload[] | undefined
): MCQ[] => {
  if (!questions) return [];

  return questions.map((q, i) => ({
    id: `q-${Date.now()}-${i}`,
    question: q.proposition,
    options: q.answers,
    answers: q.correct,
    answered: false,
  }));
};
