import { model, Schema } from "mongoose";
import { Topic } from "types/topic";

const topicSchema = new Schema<Topic>(
    {
        title: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        numberOfQuestions: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

export default model<Topic>('Topic', topicSchema);