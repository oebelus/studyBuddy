import { model, Schema } from "mongoose";
import { Flashcard } from "../interfaces/flashcard.interface";

const flashcardSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        question: { 
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

export default model<Flashcard>('Flashcards', flashcardSchema);