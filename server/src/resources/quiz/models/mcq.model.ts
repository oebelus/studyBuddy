import { model, Schema } from "mongoose";
import { MCQ, MCQItem } from "../interfaces/mcq.interface";

const mcqItemSchema = new Schema<MCQItem>({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answers: { type: [Number], required: true }
});

const mcqSchema = new Schema(
    {
        title: { type: String, required: true },
        mcqs: { type: [mcqItemSchema], required: true }
    },
    { timestamps: true }
);

export default model<MCQ>('Mcqs', mcqSchema);
