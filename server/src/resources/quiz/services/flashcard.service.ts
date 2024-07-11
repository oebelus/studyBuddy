import { Flashcard } from "../interfaces/flashcard.interface";
import flashcardModel from "../models/flashcard.model";

export default class FlashcardService {
    private flashcard = flashcardModel;

    public async save(title: string, question: string, answer: string): Promise<String | Error> {
        try {
            const mcq = await this.flashcard.create({title, question, answer})
            return "Flashcard created successfully";
        } catch (err) {
            throw new Error('Unable to create user')
        }
    }

    public async get(title: string): Promise<Flashcard | Error> {
        try {
            const mcq = this.flashcard.findOne({title})
            return mcq as unknown as Flashcard;
        } catch (err) {
            throw new Error('MCQ not found')
        }
    }
}