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
}