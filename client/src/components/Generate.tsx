import axios from "axios";
import { FormEvent, useState } from "react";
import { MCQ, Output } from "../types/output";
import { formatJson } from "../utils/format";
import { Flashcard } from "../types/flashcard";

interface GenerateProps {
    type: Output,
    setQuiz: (f: Flashcard[] | MCQ[]) => void
    setLoading: (e: boolean) => void
    setTitle: (e: string) => void
    setCategory: (e: string) => void
}

export default function Generate({type, setQuiz, setLoading, setTitle, setCategory}: GenerateProps) {
    const [form, setForm] = useState({
        topicName: "",
        numberOfQuestions: "",
        category: "",
    });
    const [language, setLanguage] = useState("english")

    const [extractedText, setExtractedText] = useState<string | undefined>('')
    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    async function handlePdf(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files![0]
        const formData = new FormData()
        formData.append('pdf', selectedFile, selectedFile!.name)

        console.log(formData)

        await axios.post(`http://localhost:3000/api/upload-pdf`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((response) => {
            setExtractedText(response.data.extractedText)
            console.log(extractedText)
            })
        .catch((error) => console.log(error))
    }

    function generate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true);

        setTitle(form.topicName)
        setCategory(form.category)

        axios.get(`http://localhost:3000/api/quiz?language=${language}&lesson=${encodeURIComponent(extractedText!)}&module=${encodeURIComponent(form.category)}&subject=${encodeURIComponent(form.topicName)}&type=${encodeURIComponent(type)}&n=${encodeURIComponent(form.numberOfQuestions)}`)
        .then((response) => {
            try {
                setLoading(false)
                console.log(response.data)
                const ans = response.data.aiResponse.trim()
                const formattedJson = formatJson(ans);
                console.log("formatted", formattedJson)
                const parsedData = JSON.parse(formattedJson);
                type === "quiz" ? setQuiz(parsedData.questions) : setQuiz(parsedData.questions);
            } catch (error) {
            setLoading(false)
            console.error('Error parsing JSON:', error);
            }
        })
        .catch((error) => {
            setLoading(false)
            console.log(error)
        })
    }

    return (
        <form onSubmit={(e)=>generate(e)} className="h-fit min-w-[50%] container mx-5 mt-4 p-4 bg-gray-100 dark:bg-[#1F1F1F] rounded-lg">
            
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-lg dark:text-white">Topic Name:</label>
                    <input
                        type="text"
                        name="topicName"
                        value={form.topicName}
                        onChange={handleInputChange}
                        className="mt-1 p-2 w-full rounded-lg border dark:bg-[#474646]"
                        placeholder="Enter topic name"
                    />
                </div>

                <div className="flex justify-between gap-4">
                    <div className="flex-1">
                        <label className="block text-lg dark:text-white">Number of questions</label>
                        <input
                            type="number"
                            name="numberOfQuestions"
                            placeholder="Number of questions"
                            value={form.numberOfQuestions}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full h-10 rounded-lg border dark:bg-[#474646]"
                            min="1"
                            max="20"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-lg dark:text-white">Language</label>
                        <select onChange={(e) => setLanguage(e.target.value)} name="language" id="language" className="mt-1 p-2 w-full h-10 rounded-lg border dark:bg-[#474646]">
                            <option value="french">French</option>
                            <option value="english">English</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-lg dark:text-white">Category:</label>
                    <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full rounded-lg border dark:bg-[#474646]"
                    placeholder="Enter category"
                    />
                </div>

                <div>
                    <label className="block text-lg dark:text-white">Upload PDF:</label>
                    <input
                        type="file"
                        name="pdf"
                        accept="application/pdf"
                        id="pdf"
                        onChange={handlePdf}
                        className="mt-1 p-2 w-full rounded-lg border dark:bg-[#474646]"
                    />
                </div>

                <button
                    type="submit"
                    className="mt-4 p-2 dark:bg-[#474646] dark:hover:bg-[#302f2f] bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Generate Flashcards
                </button>
            </div>
        </form>
  )
}
