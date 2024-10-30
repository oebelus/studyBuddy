export type MCQ = {
  id: number;
  answers: number[];
  question: string;
  options: string[];
};

export type MCQs = {
  mcqs: MCQ[];
  title: string;
  category: string;
  _id?: string;
};
