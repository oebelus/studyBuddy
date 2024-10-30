import { Types } from "mongoose" 

export interface MCQAttempt {
    mcqSetId: string;
    userId: Types.ObjectId;
    answers: {
        questionIndex: number
        selectedAnsewer: number
        isCorrect: boolean
    }[];
    score: number;
    category: string;
    timestamp: Date;
}

export interface FlashcardAttempt {
    flashcardSetId: string;
    userId: Types.ObjectId;
    ratings: {
        flashcardIndex: string;
        rating: 1 | 2 | 3 | 4 | 5;
    }[]
    category: string;
    timestamp: Date;
}