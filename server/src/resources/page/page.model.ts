import { Schema, Types, model } from "mongoose";
import Page from "./page.interface";

const pageSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

export default model<Page>('Page', pageSchema);