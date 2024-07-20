import { Flashcard } from "../interfaces/flashcard.interface";
import flashcardModel from "../models/flashcard.model";
import { Request } from "express";

export default class FlashcardService {
    private flashcard = flashcardModel;

    public async save(title: string, flashcards: any): Promise<String | Error> {
        try {
            await this.flashcard.create({title, flashcards})
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

    public async getFlashcardsTitles(
        req: Request
    ): Promise<string[] | Error> {
        try {
            const flashcards = await flashcardModel.find();
            const flashcardsTitles: string[] = [];

            flashcards.forEach((flashcard: Flashcard) => flashcardsTitles.push(flashcard.title))

            return flashcardsTitles;
        } catch (err) {
            throw new Error('MCQs not found')
        }
    }
}