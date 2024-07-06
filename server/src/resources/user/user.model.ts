import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';
import User from "@/resources/user/user.interface";
import { required } from "joi";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            // required or not, depends on Auth methods
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