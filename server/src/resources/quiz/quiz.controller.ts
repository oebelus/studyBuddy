import Controller from "@/utils/interfaces/controller.interface";
import { Router, Request, Response, NextFunction } from "express";
import HttpException from "@/utils/exceptions/http.exception";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParser from 'pdf-parse'
import multer from 'multer';
import McqService from "./services/mcq.service";
import FlashcardService from "./services/flashcard.service";
import { Flashcard } from "./interfaces/flashcard.interface";
import authenticatedMiddleware from "@/middleware/authenticated.middleware";

class QuizController implements Controller {
    public path = '/quiz';
    public pdfPath = '/upload-pdf'
    public router = Router();

    private upload: multer.Multer;
    private storage = multer.memoryStorage(); 
    private GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    private McqService = new McqService();
    private FlashcardService = new FlashcardService();

    constructor() {
        // Initialize multer
        this.upload = multer({ storage: this.storage });

        // Initialize routes
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
            authenticatedMiddleware,
            this.postFlashcard
        )

        this.router.get(
            `${this.path}/flashcard`,
            authenticatedMiddleware,
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
        const language = req.query.language
        const n = req.query.n as string

        const genAI = new GoogleGenerativeAI(this.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({model: "gemini-1.0-pro"})

        const frenchPromptMcq = `Générer JSON à partir d'un texte, vous êtes un ${module} professeur. les questions doivent avoir plusieurs réponses justes et elles doient être difficie, et issues tout le text et que le texte! Fournissez également les réponses séparément (1, 2, 3, 4, 5). Et n'envoyez que le JSON directement, sans texte d'introduction s'il vous plaît, pour que le challenge réussisse ! Votre réponse doit être dans le format suivant : {"questions": [{"id": 0, "question": "", "options": [], "answers": []}, ...], answers array should contain only numbers of the correct answers, Lisez tout le texte avant de générer un JSON. Générez ${n} questions possible avec 5 réponses exactement à choix multiple (c'est à dire une question peut avoir plusieurs réponses justes) à partir de ce texte : ${text} pour les étudiants en ${module} (ils ne comprennent que le Français), le cours est ${subject}, le module est ${module}, `
        const frenchPromptFlashcards = `Lisez tout le texte avant de générer un JSON. Générez plus de 19 flashcards à partir de ce texte : ${text} pour les étudiants en ${module} (ils ne comprennent que le Français), le cours est ${subject}, le module est ${module}! Votre réponse doit être sous le format suivant : {"questions": [{"id": 0, "question": "", "answer": ""}, ...]}, où answer doit contenir un seul élément (la réponse à la question). Assurez-vous que chaque objet question/réponse est bien formaté et que le JSON est valide.`

        const englishPromptMcq = `Generate JSON from a text, you are a ${module} professor. The questions should have multiple correct answers and they should be difficult, and derived from the entire text and only the text! Also provide the answers separately (1, 2, 3, 4, 5). And send only the JSON directly, without introductory text please, for the challenge to succeed! Your response should be in the following format: {"questions": [{"id": 0, "question": "", "options": [], "answers": []}, ...], answers array should contain only numbers of the correct answers. Read the entire text before generating the JSON. Generate ${n} possible questions with exactly 5 multiple-choice answers (i.e., a question can have multiple correct answers) from this text: ${text} for ${module} students (they only understand French), the course is ${subject}, the module is ${module}.`   
        const englishPromptFlashcards = `Read the entire text before generating the JSON. Generate more than 19 flashcards from this text: ${text} for ${module} students (they only understand French), the course is ${subject}, the module is ${module}! Your response should be in the following format: {"questions": [{"id": 0, "question": "", "answer": ""}, ...]}, where answer should contain a single element (the answer to the question). Ensure that each question/answer object is well-formatted and the JSON is valid.`

        try {
            const prompt = type == "quiz"
                ? language == "english"
                    ? englishPromptMcq
                    : frenchPromptMcq
                : language == "english"
                    ? englishPromptFlashcards
                    : frenchPromptFlashcards;

            const result = await model.generateContent(prompt);

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
            const { title, mcqs }: { title: string, mcqs: any[] } = req.body;
            
            await this.McqService.save(title, mcqs);
        
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
            const { title, category, flashcards }: { title: string, category: string, flashcards: Flashcard[] } = req.body;
            
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            await Promise.all(flashcards.map(async () => {
                await this.FlashcardService.save(
                        title,
                        category,
                        flashcards,
                        userId
                    );
                }
            ));

            res.status(201).json({ message: "Flashcards Created Successfully" });

        } catch (err) {
            next(new HttpException(400, (err as Error).message));
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
            console.log(err)
            next(new HttpException(400, (err as Error).message))
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
            console.log("error")
            res.status(400).json({ error: "No file uploaded" });
            return;
        }

        try {
            const pdfBuffer = req.file.buffer; // Access uploaded file buffer directly

            const pdfText = await pdfParser(pdfBuffer);

            const extractedText = pdfText.text;

            // Send the extracted text back to the client
            res.json({ extractedText });
        } catch (error) {
            console.error("Error processing PDF:", error);
            next(new HttpException(400, (error as Error).message));
        }
    }
}

export default QuizController;