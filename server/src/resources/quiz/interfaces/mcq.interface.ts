import { Document } from "mongoose";

export interface MCQItem {
  question: string;
  options: string[];
  answers: number[];
}

export interface MCQ extends Document {
  title: string;
  mcqs: MCQItem[];
}
