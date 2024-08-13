import { Document } from "mongoose";

export interface MCQs extends Document {
  title: string;
  category: string
  mcqs: MCQ[];
}
export interface MCQ extends Document {
  question: string;
  options: string[];
  answers: number[];
}

