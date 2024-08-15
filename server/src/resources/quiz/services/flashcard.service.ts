import mongoose, { Types } from "mongoose";
import { Flashcard, Flashcards } from "../interfaces/flashcard.interface";
import flashcardsModel from "../models/flashcard.model";
import { Request } from "express";

export default class FlashcardService {
    private flashcard = flashcardsModel;

    public async save(title: string, category: string, flashcards: Flashcard[], user: Types.ObjectId): Promise<String | Error> {
        try {
            console.log(flashcards)
            const newFlashcard: Flashcard = new this.flashcard({
                title,
                category,
                flashcards,
                user
            });
            console.log(newFlashcard)

            await newFlashcard.save();
            return "Flashcard created successfully";
        } catch (err) {
            console.log(err);
            throw new Error('Unable to create flashcards')
        }
    }

    public async get(userId: Types.ObjectId): Promise<Flashcards | Error> {
        try {
            const flashcard = this.flashcard.find({user: userId}).exec()
            return flashcard as unknown as Flashcards;
        } catch (err) {
            throw new Error('Flashcards not found')
        }
    }

    public async delete(flashcardId: string){
        try {
            const result = await this.flashcard.findByIdAndDelete(flashcardId).exec()

            if (!result) {
                throw new Error('Flashcard not found');
            }
            
        } catch (err) {
            console.log(err)
            throw new Error(`Error deleting flashcard: ${(err as Error).message}`);
        }
    }

    public async getFlashcardTopic(flashcardId: string) {
        try {
            console.log("Flashcard ID received: ", flashcardId);

            if (!flashcardId || !mongoose.Types.ObjectId.isValid(flashcardId)) {
                throw new Error('Invalid Flashcard ID');
            }

            const flashcard = await this.flashcard.findById(flashcardId).exec();

            if (!flashcard) {
                throw new Error('Flashcard not found');
            }

            return flashcard;

        } catch (err) {
            throw new Error(`Error Getting flashcard: ${(err as Error).message}`);
        }
    }
}