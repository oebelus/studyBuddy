import axios from "axios";
import { useEffect, useState } from "react";
import { formatJson } from "./utils/format"
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type Answer = { 
  [key: number]: boolean;
}

type Flashcard = {
  id: number,
  question: string,
  answer: string
}

type MCQ = {
  id: number,
  answers: number[],
  question: string,
  options: string[]
}

type Response = "quiz" | "flashcard"

function App() {
  const [extractedText, setExtractedText] = useState<string | undefined>('')
  const [pdfName, setPDFName] = useState<string | undefined>('')
  const [quiz, setQuiz] = useState<MCQ[]>([])
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [module, setModule] = useState<string>("")
  const [subject, setSubject] = useState<string>("")
  const [answersArray, setAnswersArray] = useState<Record<number, number[]>>({})
  const [correctionArray, setCorrectionArray] = useState<Record<number, Answer>>({})
  const [correctedQuestions, setCorrectedQuestions] = useState<Record<number, boolean>>({})
  const [type, setType] = useState<Response>("quiz")
  const [n, setN] = useState<number>(20)
  const [loading, setLoading] = useState(false);

	const [allPageNumbers, setAllPageNumbers] = useState<number[]>(); // default value is undefined.
	const PAGE_MAX_HEIGHT = 600; // maxHeight for scroll

  function onDocumentLoadSuccess(pdf: PDFDocumentProxy) {
		const allPageNumbers: number[] = []; // array of numbers
		for (let p = 1; p < pdf.numPages + 1; p++) {
			allPageNumbers.push(p);
		}
		setAllPageNumbers(allPageNumbers);
	}
  
  useEffect(() => {
    const initialAnswersArray: Record<number, number[]> = {};
    const initialCorrectionArray: Record<number, Answer> = {};
    const initialCorrectedQuestions: Record<number, boolean> = {};4
    
    for (let i = 0; i < quiz.length; i++) {
      initialAnswersArray[i] = [];
      initialCorrectedQuestions[i] = false

      initialCorrectionArray[i] = {
        0: quiz[i].answers.includes(0),
        1: quiz[i].answers.includes(1),
        2: quiz[i].answers.includes(2),
        3: quiz[i].answers.includes(3),
        4: quiz[i].answers.includes(4),
      };
    }
    setAnswersArray(initialAnswersArray)
    setCorrectionArray(initialCorrectionArray)
    setCorrectedQuestions(initialCorrectedQuestions)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz])

  function handleButtonClick(optionIndex:number, id: number) {
    const updatedArray = { ...answersArray };

    if (updatedArray[id].includes(optionIndex)) {
      const index = updatedArray[id].indexOf(optionIndex);
      updatedArray[id].splice(index, 1)
    } else {
      updatedArray[id].push(optionIndex)
    }
  
    setAnswersArray(updatedArray);
  }

  function handleCorrections(id: number) {
    const updatedArray = { ...correctedQuestions } 
    updatedArray[id] = !updatedArray[id] 
    setCorrectedQuestions(updatedArray)
  }

  useEffect(() => {
    console.log(type)
  }, [correctedQuestions, quiz, flashcards, type]);

  async function handlePdf(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("clicked")
    const selectedFile = e.target.files![0]
    const formData = new FormData()
    formData.append('pdf', selectedFile, selectedFile!.name)

    await axios.post(`http://localhost:3000/upload-pdf`, formData)
      .then((response) => {
        setExtractedText(response.data.extractedText)
        setPDFName(response.data.pdfName)
        console.log(extractedText ? "is there" : "no text", pdfName)
        })
      .catch((error) => console.log(error))
  }

  function generateMcq(types: "quiz" | "flashcard") {
    setLoading(true);
    setType(types)
    console.log(type)
    axios.get(`http://localhost:3000/api/questions?lesson=${encodeURIComponent(extractedText!)}&module=${encodeURIComponent(module)}&subject=${encodeURIComponent(subject)}&type=${encodeURIComponent(type)}&n=${encodeURIComponent(n)}`)
      .then((response) => {
        try {
          setLoading(false)
          console.log(response.data)
          const ans = response.data.aiResponse
          const formattedJson = formatJson(ans.toString().trim());
          const parsedData = JSON.parse(formattedJson);
          type === "quiz" ? setQuiz(parsedData.questions) : setFlashcards(parsedData.questions);
          console.log(quiz)
          console.log(flashcards)
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      })
      .catch((error) => console.log(error))
  }

  return (
    <div className={`bg-zinc-900 ${quiz.length > 0 || pdfName != "" ? "h-full" : "h-screen"}`}>
      <div className="flex justify-center bg-white">
        <h1 className="text-2xl font-semibold p-2 text-zinc-800 font-serif">StudyBuddy,</h1>
        <span className="text-zinc-600 p-2 mt-1">generates MCQs and Flashcards, Previews PDF</span>
      </div>
      <div className="flex flex-col justify-center">
        <div className="bg-white w-fit h-fit p-3 rounded mx-auto mt-4">
          <div className="lg:flex lg:justify-between lg:items-center">
            <div className="flex flex-row gap-4">
              <p className="text-black font-semibold text-xl">Select File:</p>
              <input className="mt-1" onChange={handlePdf} type="file" name="pdf" id="pdf" accept="application/pdf" />
            </div>
            <div className="flex mt-6 lg:mt-1 gap-2">
              <input required onChange={(e) => setModule(e.target.value)} value={module} className="shadow p-2" placeholder="Module Name" type="text" name="module" id="module" />
              <input required onChange={(e) => setSubject(e.target.value)} value={subject} className="shadow p-2" placeholder="Lesson Name" type="text" name="subject" id="subject" />
              <input required onChange={(e) => setN(parseInt(e.target.value))} value={n} className="shadow p-2" placeholder="Questions" type="number" name="number" id="number" />
            </div>
          </div>
          <input className="hidden" type="text" value={extractedText} onChange={(e) => setExtractedText(e.target.value)} name="lesson" />
        </div>
        <div className="flex justify-center gap-4">
          <button onClick={() => generateMcq("quiz")} type="button" className="mt-4 px-5 py-3 font-semibold text-zinc-900 rounded bg-white">Generate MCQ</button>
          <button onClick={() => generateMcq("flashcard")} type="button" className="mt-4 px-5 py-3 font-semibold text-zinc-900 rounded bg-white">Generate Flashcards</button>
        </div>
        <button className={`${loading ? "" : "hidden"}`} type="submit">{loading ? <div className="w-16 h-16 mx-auto mt-5 border-4 border-dashed rounded-full animate-spin border-white"></div> : "<>Search</>"}</button>
        <div className="flex justify-center flex-col lg:flex-row">
          <div className="flex justify-center mt-8 mx-auto">
            {pdfName && (
              <Document file={`/pdfs/${pdfName}`}
                onLoadSuccess={onDocumentLoadSuccess}>
                <div
                  style={{
                    maxHeight: `${PAGE_MAX_HEIGHT}px`,
                    overflowY: 'scroll', 
                    overflowX: 'hidden',

                    border: '2px solid lightgray',
                    borderRadius: '5px',
                  }}>

                  {allPageNumbers
                  ? allPageNumbers.map((pn) => (
                    <Page key={`page-${pn}`} pageNumber={pn} />
                  ))
                  : undefined}
                </div>
              </Document>
            )}
          </div>
          <div className="mx-auto mt-4">
            {quiz.length > 0 && type == "quiz" && <p className="p-4 text-white">Number of questions: {quiz.length - 1}</p>}
            {flashcards.length > 0 && type =="flashcard" && <p className="p-4 text-white">Number of questions: {flashcards.length - 1}</p>}
            <div className="overflow-auto max-h-[400px] md:max-h-[600px]">
              {type == "quiz" && quiz.length > 4 && quiz.map((question: MCQ, index: number) => (
                <div key={index} className="mb-10">
                  <div className="bg-white rounded md:w-[550px] ">
                    <h3 className="px-4 py-3">{question.question}</h3>
                  </div>
                  <div className="flex flex-col gap-2 mt-4 mb-4 justify-center">
                    {question.options.map((option: string, optionIndex: number) => (
                      <button
                        key={optionIndex}
                        type="button"
                        className={`px-8 py-3 w-full md:w-[550px] rounded text-white font-semibold
                        ${correctedQuestions[index] ? (correctionArray[index][optionIndex] ? "bg-green-800" : "bg-red-800") : (answersArray[index] && answersArray[index].includes(optionIndex) ? 'bg-zinc-400 text-zinc-900' : 'bg-zinc-700 hover:bg-zinc-600')}
                        `}
                        onClick={() => handleButtonClick(optionIndex, index)}
                      >
                      {option}
                    </button>
                    ))}
                  </div>
                  <button onClick={() => handleCorrections(index)} type="button" className="mx-auto flex px-5 py-3 font-semibold text-white text-zinc-900 bg-white rounded">Correction</button>
                </div>
              ))}
            </div>
            <div className="overflow-auto max-h-[400px] md:max-h-[600px]">
              {flashcards.length > 0 && type == "flashcard" &&
              flashcards.map((question: Flashcard, index: number) => (
                <div className="max-w-lg mt-6 bg-white p-4 rounded shadow">
                  <div className="divide-y divide-gray-100">
                    <details key={index} className="group">
                      <summary
                        className="flex cursor-pointer list-none items-center justify-between text-lg font-medium text-secondary-900 group-open:text-primary-500">
                        {question.question}
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" className="block h-5 w-5 group-open:hidden">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" className="hidden h-5 w-5 group-open:block">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                            </svg>
                        </div>
                      </summary>
                      <div className="pb-4 text-secondary-500 bg-zinc-200 p-4 rounded">{question.answer}</div>
                    </details>
                  </div>
                </div>
              ))}
            </div>
            {quiz.length && flashcards.length && <p className="p-4 text-white font-mono">Nothing to show ;) Try uploading a PDF</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
