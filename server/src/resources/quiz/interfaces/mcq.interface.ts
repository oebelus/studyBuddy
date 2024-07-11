import { Document } from "mongoose"

export interface MCQ extends Document {
  title: string,
  answers: number[],
  question: string,
  options: string[],
}
