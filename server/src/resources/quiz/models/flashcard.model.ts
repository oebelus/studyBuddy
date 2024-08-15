import { model, Schema, Types } from "mongoose";
import { Flashcard } from "../interfaces/flashcard.interface";
import { v4 as uuidv4 } from 'uuid';

// Define the schema for individual flashcards
const flashcardSchema = new Schema(
    {
        question: { 
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true
        },
    },
    { _id: false }
);

// Define the schema for the flashcard set with a title and an array of flashcards
const flashcardsSchema = new Schema(
    {
        id: {
            type: String,
            default: uuidv4, // Automatically generate a unique id for each flashcard
        },
        title: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        flashcards: [flashcardSchema], // Array of flashcards
        user: {
            type: Types.ObjectId,
            ref: 'User',
            required: true
        },
    },
    { timestamps: true }
);

export default model<Flashcard>('Flashcards', flashcardsSchema);
