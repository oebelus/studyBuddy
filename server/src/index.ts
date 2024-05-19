import express from 'express'
import cors from 'cors'
import Groq from "groq-sdk";
import dotenv from 'dotenv'
import pdfParser from 'pdf-parse'
import multer from 'multer';

dotenv.config()

const app = express()
const PORT = 3000

const storage = multer.memoryStorage();
var upload = multer({ storage: storage })

const GROQ_API_KEY = process.env.GROQ_API_KEY

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173'
}))

app.get('/api/questions', async (req, res) => {
    console.log("GET /api/questions")
    const text = req.query.lesson
    console.log("text", text)

    const openai = new Groq({
        apiKey: GROQ_API_KEY
    })
    const model = "llama3-8b-8192"

    const frenchPrompt = `Lisez tout le texte. Générez le maximum des questions questions possible avec 5 réponses exactement à choix multiple (c'est à dire une question peut avoir plusieurs réponses justes) à partir de ce texte : ${text} pour les étudiants en médecine, les questions doivent avoir plusieurs réponses justes et elles doient être difficie, et issues tout le text et que le texte! Fournissez également les réponses séparément (1, 2, 3, 4, 5). Et n'envoyez que le JSON directement, sans texte d'introduction s'il vous plaît, pour que le challenge réussisse ! Votre réponse doit être dans le format suivant : {"questions": [{"id": 0, "question": "", "options": [], "answers": []}, ...], answers array should contain only numbers of the correct answers}`
    const englishPrompt = `You are a quiz master and a medical professional that wants to create a quiz containing the maximum number of questions from this text: ${text} for students. Generate as many questions as possible with 5 multiple choice answers each. Also, provide the answer separately (1, 2, 3, 4, 5). Your response should be in the following format: {"questions": [{"id": 0, "question": "", "options": [], "answer": 1}, ...]}`
    
    const completion = await openai.chat.completions.create({
        model: model,
        messages: [
            { 
                role: "user", 
                content: frenchPrompt,
            }
        ],
    })

    const aiResponse = completion.choices[0].message.content
    res.json({aiResponse})
})

app.post("/upload-pdf", upload.single('pdf'), async (req, res) => {
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
    console.error("Error parsing PDF:", error);
    res.status(500).send("Error parsing PDF");
  }
})

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})
