import axios from "axios"
import { useState } from "react"

interface QuestionFormProps {
    extractedText: string | undefined,
}

export default function QuestionForm({extractedText}: QuestionFormProps) {
    const [answer, setAnswer] = useState<string>("")
    const [answerLoading, setAnswerLoading] = useState<boolean>(false)
    const [question, setQuestion] = useState<string>("")

    function askQuestion() {
        setAnswerLoading(true)
        axios.get(`http://localhost:3000/api/question?question=${question}&lesson=${extractedText}`)
            .then((response) => {
                setAnswerLoading(false)
                setAnswer(response.data.aiResponse)
            })
            .catch(error => {
                setAnswerLoading(false)
                console.log(error)
        })
    }
    
    return (
        <div className="bg-white p-4 rounded mb-4 max-w-[38rem]">
            <div className="flex gap-5 flex-col">
            <div className="flex gap-2">
                <input name="question" value={question} onChange={(e) => setQuestion(e.target.value)} className="shadow w-full" type="text"/>
                <button onClick={askQuestion} className="font-semibold text-white p-1 rounded bg-zinc-900 hover:bg-zinc-800 transition">Ask a Question</button>
            </div>
            {answerLoading ? 
                <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 rounded-full animate-pulse dark:bg-zinc-600"></div>
                <div className="w-4 h-4 rounded-full animate-pulse dark:bg-zinc-600"></div>
                <div className="w-4 h-4 rounded-full animate-pulse dark:bg-zinc-600"></div>
                </div>
                :
                answer != "" && <p>{answer}</p>}
            </div>
        </div>
    )
}
