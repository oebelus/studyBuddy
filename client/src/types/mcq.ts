export type MCQ = {
  id: string;
  answers: number[];
  question: string;
  options: string[];
  answered?: boolean;
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

export interface EditingQuestion {
  index: number;
  text: string;
}

export interface AddingOption {
  text: string;
  isCorrect: boolean;
}

export interface SelectedOptions {
  [key: number]: number[];
}
