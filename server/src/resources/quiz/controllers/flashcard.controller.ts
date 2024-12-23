import FlashcardService from "../services/flashcard.service";
import authenticatedMiddleware from "@/middleware/authenticated.middleware";
import HttpException from "@/utils/exceptions/http.exception";
import { Router, Request, Response, NextFunction } from "express";
import { Flashcard } from "../interfaces/flashcard.interface";

class FlashcardController {
    public path = '/flashcard';
    public router = Router();

    private FlashcardService = new FlashcardService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}`,
            authenticatedMiddleware,
            this.postFlashcard
        )

        this.router.get(
            `${this.path}`,
            authenticatedMiddleware,
            this.getFlashcard
        )

        this.router.get(
            `${this.path}/:id`,
            this.getFlashcardTopic
        )

        // this.router.delete(
        //     `${this.path}/flashcard/:id`,
        //     authenticatedMiddleware,
        //     this.deleteFlashcard
        // )
    }

    private postFlashcard = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { title, category, flashcards }: { title: string, category: string, flashcards: Flashcard[] } = req.body;
            
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }
            
            console.log(flashcards);

            await this.FlashcardService.save(title, category, flashcards, userId);

            res.status(201).json({ message: "Flashcards Created Successfully" });

        } catch (err) {
            next(new HttpException(400, (err as Error).message));
        }
    }

    private getFlashcard = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            const flashcard = await this.FlashcardService.get(userId);

            res.status(200).json({flashcard})
        } catch (err) {
            console.log(err)
            next(new HttpException(400, (err as Error).message))
        }
    }

    private getFlashcardTopic = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const flashcardId = req.params.id;

            const flashcard = await this.FlashcardService.getFlashcardTopic(flashcardId);

            res.status(200).json({flashcard})
        } catch (err) {
            console.log(err)
            next(new HttpException(400, (err as Error).message))
        }
    }

    private deleteFlashcard = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const flashcardId = req.params.id;
            await this.FlashcardService.delete(flashcardId);

            res.status(200).json("Flashcard Deleted Successfully")
        } catch (err) {
            next(new HttpException(400, (err as Error).message))
        }
    }
}

export default FlashcardController;