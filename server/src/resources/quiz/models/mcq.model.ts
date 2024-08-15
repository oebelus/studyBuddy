import { model, Schema, Types } from "mongoose";
import { MCQ } from "../interfaces/mcq.interface";
import { v4 as uuidv4 } from 'uuid';

const mcqSchema = new Schema<MCQ>(
  {
    question: { 
      type: String, 
      required: true 
    },
    options: { 
      type: [String], 
      required: true 
    },
    answers: { 
      type: [Number], 
      required: true 
    }
  },
  { _id: false }
);

const mcqsSchema = new Schema(
    {
        title: { type: String, required: true },
        mcqs: { type: [mcqSchema], required: true },
        category: { type: String, required: true },
        user: {
            type: Types.ObjectId,
            ref: 'User',
            required: true
        },
        id: {
            type: String,
            default: uuidv4, 
        },
    },
    { timestamps: true }
);

export default model<MCQ>('Mcqs', mcqsSchema);
