import { Document } from "mongoose"
import { MCQ } from "../quiz/interfaces/mcq.interface"
import { Flashcard } from "../quiz/interfaces/flashcard.interface"

interface User extends Document {
    username: string,
    email: string,
    password: string,
    role: string,
    mcqs: MCQ[],
    flashcards: Flashcard[],
    titles: string[]

    isValidPassword(password: string): Promise<Error | boolean>,
}

export default User