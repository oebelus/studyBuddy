import { Document } from "mongoose"

export interface Flashcard extends Document {
    title: string,
    question: string,
    answer: string
}