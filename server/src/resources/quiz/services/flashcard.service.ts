import mongoose, { Types } from "mongoose";
import { Flashcard } from "../interfaces/flashcard.interface";
import flashcardsModel from "../models/flashcard.model";
import { Request } from "express";

export default class FlashcardService {
    private flashcard = flashcardsModel;

    public async save(title: string, category: string, flashcards: Flashcard[], user: Types.ObjectId): Promise<String | Error> {
        try {
            const newFlashcard: Flashcard = new this.flashcard({
                title,
                category,
                flashcards,
                user
            });

            //await this.flashcard.create({title, flashcards})
            await newFlashcard.save();
            return "Flashcard created successfully";
        } catch (err) {
            throw new Error('Unable to create user')
        }
    }

    public async get(userId: Types.ObjectId): Promise<Flashcard | Error> {
        try {
            const mcq = this.flashcard.find({user: userId}).exec()
            return mcq as unknown as Flashcard;
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