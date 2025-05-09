import HttpException from "@/utils/exceptions/http.exception";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import pdfParser from 'pdf-parse'

class GenerateController {
    public path = '/generate'
    public router = Router();

    private upload: multer.Multer;
    private storage = multer.memoryStorage(); 
    private GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    constructor() {
        this.upload = multer({ storage: this.storage });

        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(
            `${this.path}/upload-pdf`, 
            this.upload.single('pdf'),
            this.postPDF
        )

        this.router.post(
            `${this.path}`,
            this.generate
        )
    }
    
    private generate = async (
        req: Request,
        res:Response,
        next: NextFunction
    ) => {
        const { lesson, module, subject, type, language, n } = req.body

        const genAI = new GoogleGenerativeAI(this.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"})

        const frenchPromptMcq = `Générer JSON en Francais à partir de ce texte: ${lesson}, vous êtes un ${module} professeur. les questions doivent avoir plusieurs réponses justes (avec au moins une réponse fausse) et elles doient être difficie, et issues tout le text et que le texte! Fournissez également les réponses séparément (1, 2, 3, 4, 5). Et n'envoyez que le JSON directement, sans texte d'introduction s'il vous plaît, pour que le challenge réussisse ! Votre réponse doit être dans le format suivant : {"questions": [{"id": 0, "question": "", "options": [], "answers": []}, ...], answers array should contain only numbers of the correct answers, Lisez tout le texte avant de générer un JSON. Générez ${n} questions possible avec 5 réponses exactement à choix multiple (c'est à dire une question peut avoir plusieurs réponses justes) à partir de ce texte : ${module} pour les étudiants en ${module} (ils ne comprennent que le Français), le cours est ${subject}, le module est ${module}, `
        const frenchPromptFlashcards = `Lisez tout le texte avant de générer un JSON en Francais. Générez plus de 19 flashcards à partir de ce texte : ${lesson} pour les étudiants en ${module} (ils ne comprennent que le Français), le cours est ${subject}, le module est ${module}! Votre réponse doit être sous le format suivant : {"questions": [{"id": 0, "question": "", "answer": ""}, ...]}, où answer doit contenir un seul élément (la réponse à la question). Assurez-vous que chaque objet question/réponse est bien formaté et que le JSON est valide.`

        const englishPromptMcq = `Generate JSON from a text, you are a ${module} professor. The questions should have multiple correct answers and they should be difficult, and derived from the entire text and only the text! Also provide the answers separately (1, 2, 3, 4, 5). And send only the JSON directly, without introductory text please, for the challenge to succeed! Your response should be in the following format: {"questions": [{"id": 0, "question": "", "options": [], "answers": []}, ...], answers array should contain only numbers of the correct answers. Read the entire text before generating the JSON. Generate ${n} possible questions with exactly 5 multiple-choice answers (i.e., a question can have multiple correct answers) from this text: ${module} for ${module} students (they only understand French), the course is ${subject}, the module is ${module}.`   
        const englishPromptFlashcards = `Read the entire text before generating the JSON. Generate more than 19 flashcards from this text: ${lesson} for ${module} students, the course is ${subject}, the module is ${module}! Your response should be in the following format: {"questions": [{"id": 0, "question": "", "answer": ""}, ...]}, where answer should contain a single element (the answer to the question). Ensure that each question/answer object is well-formatted and the JSON is valid.`

        try {
            const prompt = (type === "quiz" && language === "english")
                ? englishPromptMcq
                : (type === "quiz" && language === "french")
                ? frenchPromptMcq
                : (type === "flashcard" && language === "english")
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

    private postPDF = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }

        try {
            const pdfBuffer = req.file.buffer; // Access uploaded file buffer directly

            const pdfText = await pdfParser(pdfBuffer);

            const extractedText = pdfText.text;

            res.json({ extractedText });
        } catch (error) {
            next(new HttpException(400, (error as Error).message));
        }
    }
}

export default GenerateController;