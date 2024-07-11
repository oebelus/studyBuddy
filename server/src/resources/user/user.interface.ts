import { Document } from "mongoose"
import { Flashcard, MCQ } from "../quiz/interfaces/mcq.interface"

interface User extends Document {
    username: string,
    email: string,
    password: string,
    role: string,
    mcqs: [MCQ],
    flashcards: [Flashcard]

    isValidPassword(password: string): Promise<Error | boolean>,
}

export default User