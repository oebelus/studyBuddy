import { Schema, Types, model } from "mongoose";
import bcryptjs from "bcryptjs";
import User from "@/resources/user/user.interface";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        mcqs: [{
            type: Types.ObjectId, ref: 'Mcqs'
        }],
        flashcards: [{
            type: Types.ObjectId, ref: 'Flashcards'
        }],
        titles: [{
            title: String,
            category: String,
            numberOfQuestions: Number
        }],
        page: [{
            type: Types.ObjectId, ref: 'Page'
        }]
    },
    { timestamps: true }
)

// Hashing the password before it's added to the database
userSchema.pre<User>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const hash = await bcryptjs.hash(this.password, 10);
    this.password = hash;

    next();
})

userSchema.methods.isValidPassword = async function (
    password: string) : Promise<Error | boolean> {
        return await bcryptjs.compare(password, this.password);
}

export default model<User>('User', userSchema);