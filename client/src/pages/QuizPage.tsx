import axios from "axios";
import { useState } from "react";
import { Flashcard, MCQ, Output } from "../types/output";
import { formatJson } from "../utils/format";
import GenerateMenu from "../components/dashboard/generateMenu/GenerateMenu";
import PDFSection from "../components/dashboard/pdf/PDFSection";
import Quiz from "../components/Quiz";

function QuizPage() {
  const [extractedText, setExtractedText] = useState<string | undefined>('')
  const [pdfName, setPDFName] = useState<string | undefined>('')
  const [quiz, setQuiz] = useState<MCQ[]>([])
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [module, setModule] = useState<string>("")
  const [subject, setSubject] = useState<string>("")
  
  const [type, setType] = useState<Output>("quiz")
  const [n, setN] = useState<number>(20)
  const [loading, setLoading] = useState(false);

  async function handlePdf(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files![0]
    const formData = new FormData()
    formData.append('pdf', selectedFile, selectedFile!.name)

    await axios.post(`http://localhost:3000/api/upload-pdf`, formData)
      .then((response) => {
        setExtractedText(response.data.extractedText)
        setPDFName(response.data.pdfName)
        console.log(extractedText ? "is there" : "no text", pdfName)
        })
      .catch((error) => console.log(error))
  }

  function generateMcq(types: Output) {
    setLoading(true);
    setType(types)
    console.log(type)
    axios.get(`http://localhost:3000/api/quiz?lesson=${encodeURIComponent(extractedText!)}&module=${encodeURIComponent(module)}&subject=${encodeURIComponent(subject)}&type=${encodeURIComponent(type)}&n=${encodeURIComponent(n)}`)
      .then((response) => {
        try {
          setLoading(false)
          console.log(response.data)
          const ans = response.data.aiResponse.trim()
          const formattedJson = formatJson(ans);
          console.log("formatted", formattedJson)
          const parsedData = JSON.parse(formattedJson);
          type === "quiz" ? setQuiz(parsedData.questions) : setFlashcards(parsedData.questions);
          console.log("quiz", quiz)
          console.log("flashcards", flashcards)
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
    <div className={`bg-white dark:bg-[#121212] ${quiz.length > 0 || pdfName != "" ? "h-full" : "h-screen"}`}>
      <div className="flex flex-col justify-center">
        <GenerateMenu 
          extractedText={extractedText} 
          setExtractedText={setExtractedText} 
          handlePdf={handlePdf}
          generateMcq={generateMcq}
          setModule={setModule}
          module={module}
          setSubject={setSubject}
          subject={subject}
          setN={setN}
          n={n}  
        />
        <button className={`${loading ? "" : "hidden"}`} type="submit">{loading ? <div className="w-16 h-16 mx-auto mt-5 border-4 border-dashed rounded-full animate-spin border-white"></div> : "<>Search</>"}</button>
        
        <div className="flex justify-center flex-col lg:flex-row">
          {pdfName && <PDFSection extractedText={extractedText} pdfName={pdfName} />}
          <Quiz quiz={quiz} flashcards={flashcards} extractedText={extractedText} type={type} />
        </div>
      </div>

      {((quiz.length == 0 && flashcards.length == 0) && !extractedText) && <p className="p-4 text-white font-mono text-center">Nothing to show ;) Try uploading a PDF</p>}
    </div>
  )
}

export default QuizPage
