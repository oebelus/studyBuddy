import Controller from "@/utils/interfaces/controller.interface";
import { Router, Request, Response, NextFunction } from "express";
import HttpException from "@/utils/exceptions/http.exception";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParser from 'pdf-parse'
import multer from 'multer';
import McqService from "./services/mcq.service";
import FlashcardService from "./services/flashcard.service";

class QuizController implements Controller {
    public path = '/quiz';
    public pdfPath = '/upload-pdf'
    public router = Router();
    private storage = multer.memoryStorage();
    private upload = multer({ storage: this.storage })
    private GEMINI_API_KEY = process.env.GEMINI_API_KEY
    private McqService = new McqService();
    private FlashcardService = new FlashcardService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(
            `${this.path}`,
            this.getQuiz
        ),

        this.router.post(
            `${this.pdfPath}`, 
            this.upload.single('pdf'),
            this.postPDF
        )

        this.router.post(
            `${this.path}/mcq`,
            this.postMcq
        )

        this.router.get(
            `${this.path}/mcq/:title`,
            this.getMcq
        )

        this.router.post(
            `${this.path}/flashcard`,
            this.postFlashcard
        )

        this.router.get(
            `${this.path}/flashcard`,
            this.getFlashcard
        )

        this.router.get(
            `${this.path}/titles`,
            this.getTitles
        )
    }

    // single page application, req user again to see if it's up to date
    private getQuiz = async (
        req: Request,
        res:Response,
        next: NextFunction
    ) => {
        const text = req.query.lesson

        const module = req.query.module
        const subject = req.query.subject
        const type = req.query.type
        const n = req.query.n as string

        const genAI = new GoogleGenerativeAI(this.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({model: "gemini-1.0-pro"})

        const frenchPromptMcq = `Générer JSON à partir d'un texte, vous êtes un médecin professeur. les questions doivent avoir plusieurs réponses justes et elles doient être difficie, et issues tout le text et que le texte! Fournissez également les réponses séparément (1, 2, 3, 4, 5). Et n'envoyez que le JSON directement, sans texte d'introduction s'il vous plaît, pour que le challenge réussisse ! Votre réponse doit être dans le format suivant : {"questions": [{"id": 0, "question": "", "options": [], "answers": []}, ...], answers array should contain only numbers of the correct answers, Lisez tout le texte avant de générer un JSON. Générez ${n} questions possible avec 5 réponses exactement à choix multiple (c'est à dire une question peut avoir plusieurs réponses justes) à partir de ce texte : ${text} pour les étudiants en médecine (ils ne comprennent que le Français), le cours est ${subject}, le module est ${module}, `
        const frenchPromptFlashcards = `Lisez tout le texte avant de générer un JSON. Générez plus de 19 flashcards à partir de ce texte : ${text} pour les étudiants en médecine (ils ne comprennent que le Français), le cours est ${subject}, le module est ${module}! Votre réponse doit être sous le format suivant : {"questions": [{"id": 0, "question": "", "answer": ""}, ...]}, où answer doit contenir un seul élément (la réponse à la question). Assurez-vous que chaque objet question/réponse est bien formaté et que le JSON est valide.`

        try {
            const result = await model.generateContent(type == "quiz" ? frenchPromptMcq : frenchPromptFlashcards);

            const aiResponse = result.response;
            const response = aiResponse.text()

            res.json({aiResponse: response})
        } catch (err) {
            next(new HttpException(400, (err as Error).message))
        }
    }

    private postMcq = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const mcqs: Array<{ title: string; question: string; options: string[]; answers: number[] }> = req.body;

            for (const mcq of mcqs) {
                await this.McqService.save(mcq.title, mcq.question, mcq.options, mcq.answers);
            }
        
            res.status(201).json({message: "MCQs Created Successfully"})
        } catch (err) {
            next(new HttpException(400, (err as Error).message))
        }
    }

    private postFlashcard = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const flashcards: Array<{ title: string; question: string; answer: string }> = req.body;

            for (const flashcard of flashcards) {
                await this.FlashcardService.save(flashcard.title, flashcard.question, flashcard.answer);
            }
        
            res.status(201).json({message: "Flashcards Created Successfully"})
        } catch (err) {
            next(new HttpException(400, (err as Error).message))
        }
    }

    private getMcq = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const title = req.params.title
            console.log(title);
            
            const mcq = await this.McqService.get(title);

            res.status(200).json({mcq})
        } catch (err) {
            next(new HttpException(400, (err as Error).message))
        }
    }

    private getFlashcard = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const title = req.params.title
            const flashcard = await this.FlashcardService.get(title);

            res.status(200).json({flashcard})
        } catch (err) {
            next(new HttpException(400, (err as Error).message))
        }
    }

    private getTitles = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const mcqsTitles = await this.McqService.getMcqsTitles(req);
            const flashcardTitles = await this.FlashcardService.getFlashcardsTitles(req);

            const titles = [...new Set([...mcqsTitles as string[], ...flashcardTitles as string[]])]
            
            res.status(200).json({ titles: titles })
        } catch (err) {
            next(new HttpException(400, (err as Error).message))
        }
    }

    private postPDF = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }

        try {
            const pdfBuffer = req.file.buffer; // Access uploaded file buffer directly
            const pdfText = await pdfParser(pdfBuffer);
            const extractedText = pdfText.text;

            // Process the extracted text here or return it as a response
            res.json({ extractedText });
        } catch (error) {
            next(new HttpException(400, (error as Error).message))
        }
    }
}

export default QuizController;