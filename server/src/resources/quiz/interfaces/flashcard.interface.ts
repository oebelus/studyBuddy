import { Document } from "mongoose"

export interface Flashcards extends Document {
    title: string,
    category: string,
    flashcards: Flashcard[]
}
export interface Flashcard extends Document {
    question: string;
    answer: string;
}