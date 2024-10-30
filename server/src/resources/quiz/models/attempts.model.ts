import { model, Schema } from "mongoose";
import { FlashcardAttempt, MCQAttempt } from "../interfaces/attempt.interface";

const mcqAttemptSchema  = new Schema<MCQAttempt>({
    mcqSetId: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: [{
        questionIndex: Number,
        selectedAnswer: Number,
        isCorrect: Boolean,
    }],
    score: Number,
    category: String,
    timestamp: {
        type: Date,
        default: Date.now,
    }
})

const flashcardAttemptSchema  = new Schema<FlashcardAttempt>({
    flashcardSetId: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ratings: [{
        flashcardIndex: String,
        rating: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
        }
    }],
    category: String,
    timestamp: {
        type: Date,
        default: Date.now,
    }
})

export const MCQAttemptModel = model<MCQAttempt>('McqAttempt', mcqAttemptSchema);
export const FlashcardAttemptModel  = model<FlashcardAttempt>('FlashcardAttempt', flashcardAttemptSchema)