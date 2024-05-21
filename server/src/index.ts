import express from 'express'
import cors from 'cors'
import Groq from "groq-sdk";
import dotenv from 'dotenv'
import pdfParser from 'pdf-parse'
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config()

const app = express()
const PORT = 3000

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../../client/public/pdfs'))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173'
}))

app.get('/api/questions', async (req, res) => {
    console.log("GET /api/questions")
    const text = req.query.lesson
    const module = req.query.module
    const subject = req.query.subject
    const type = req.query.type
    const n = req.query.n as string

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({model: "gemini-1.0-pro"})

    const frenchPromptMcq = `Générer JSON et respectez le format à partir d'un texte, vous êtes un médecin professeur. Générez es ${n} QCMS, les questions doivent avoir plusieurs réponses justes 'maximum 5 réponses justes, minimum 2) et elles doient être difficie, et issues tout le text et que le texte! Fournissez également les réponses séparément (1, 2, 3, 4, 5). Et n'envoyez que le JSON directement, sans texte d'introduction s'il vous plaît, pour que le challenge réussisse ! Votre réponse doit être dans le format suivant : {"questions": [{"id": 0, "question": "", "options": [], "answers": []}, ...], answers array should contain only numbers of the correct answers, Lisez tout le texte avant de générer un JSON. Générez ${n} questions possible avec 5 réponses exactement à choix multiple (c'est à dire une question peut avoir plusieurs réponses justes) à partir de ce texte : ${text} pour les étudiants en médecine (ils ne comprennent que le Français), le cours est ${subject}, le module est ${module}, `
    const frenchPromptFlashcards = `Lisez tout le texte avant de générer un JSON et respectez le format du JSON. Générez ${n} flashcards à partir de ce texte : ${text} pour les étudiants en médecine (ils ne comprennent que le Français), le cours est ${subject}, le module est ${module}! Votre réponse doit être sous le format suivant : {"questions": [{"id": 0, "question": "", "answer": ""}, ...]}, où answer doit contenir un seul élément (la réponse à la question). Assurez-vous que chaque objet question/réponse est bien formaté et que le JSON est valide.`

    const englishPrompt = `You are a quiz master and a medical professional that wants to create a quiz containing the maximum number of questions from this text: ${text} for students. Generate as many questions as possible with 5 multiple choice answers each. Also, provide the answer separately (1, 2, 3, 4, 5). Your response should be in the following format: {"questions": [{"id": 0, "question": "", "options": [], "answer": 1}, ...]}`
    console.log(type)
    const result = await model.generateContent(type == "quiz" ? frenchPromptMcq : frenchPromptFlashcards);

    const aiResponse = result.response;
    const response = aiResponse.text()
    
    res.json({aiResponse: response})
})

app.post("/upload-pdf", upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  try {
  const filePath = path.resolve(__dirname, '../../client/public/pdfs', req.file.filename);
    const name = req.file.filename
    console.log(name)
    const pdfBuffer = fs.readFileSync(filePath); // Read file from disk as buffer

    const pdfText = await pdfParser(pdfBuffer);
    const extractedText = pdfText.text;

    res.json({ extractedText: extractedText, pdfName: name });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    res.status(500).send("Error parsing PDF");
  }
})

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})
