import { Document } from "mongoose";

export interface Topic extends Document {
    title: string;
    category: string;
    numberOfQuestions: number;
}