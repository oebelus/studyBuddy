import { model, Schema } from "mongoose";
import { MCQ } from "../interfaces/mcq.interface";

const mcqSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        question: { 
            type: String,
            required: true,
        },
        options: [{
            option: String,
        }],
        answers: [{
            answer: Number,
        }]
    },
    { timestamps: true }
)

export default model<MCQ>('Mcqs', mcqSchema); 