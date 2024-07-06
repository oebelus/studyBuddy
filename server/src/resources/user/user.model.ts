import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';
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
        }
    },
    { timestamps: true }
)

// Hashing the password before it's added to the database
userSchema.pre<User>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
})

userSchema.methods.isValidPassword = async function (
    password: string) : Promise<Error | boolean> {
        return await bcrypt.compare(password, this.password);
}

export default model<User>('User', userSchema);