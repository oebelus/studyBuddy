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

export interface EditingOption {
  index: number;
  text: string;
  isCorrect: boolean;
}

export interface AddingOption {
  text: string;
  isCorrect: boolean;
}

export interface SelectedOptions {
  [key: number]: number[];
}
