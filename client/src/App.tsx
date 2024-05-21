import axios from "axios";
import { useEffect, useState } from "react";
import { formatJson } from "./utils/format"
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type Answer = {
  0: boolean,
  1: boolean,
  2: boolean,
  3: boolean,
  4: boolean
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
  const [type, setType] = useState<boolean>(false)

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
    const initialCorrectedQuestions: Record<number, boolean> = {};
    
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
    // console.log("corrected questions", correctedQuestions[id])
    // console.log("corrected array", correctionArray[id][1] ? "trueeeeee ": "faaaalse")
    setCorrectedQuestions(updatedArray)
  }

  useEffect(() => {
  }, [correctedQuestions]);

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

  function generateMcq(types: boolean) {
    axios.get(`http://localhost:3000/api/questions?lesson=${encodeURIComponent(extractedText!)}&module=${encodeURIComponent(module)}&subject=${encodeURIComponent(subject)}&type=${encodeURIComponent(types)}`)
      .then((response) => {
        try {
          const ans = response.data.aiResponse;
          setType(types)
          type ? setQuiz(JSON.parse(formatJson(ans).toString().trim()).questions) : setFlashcards(JSON.parse(formatJson(ans).toString().trim()).questions)
          //console.log(JSON.parse(formatJson(ans).toString()).questions)
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      })
      .catch((error) => console.log(error))
  }

  return (
    <div className={`bg-zinc-800 ${quiz.length > 0 || pdfName != "" ? "h-full" : "h-screen"}`}>
      <h1 className="text-5xl flex justify-center font-semibold p-6 text-white font-serif">PDF to MCQ Generator</h1>
      <div className="flex flex-col justify-center">
        <div className="bg-white w-fit h-fit p-3 rounded mx-auto mt-4">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <p className="text-black font-semibold text-xl mb-5">Select File:</p>
              <input onChange={handlePdf} type="file" name="pdf" id="pdf" accept="application/pdf" />
            </div>
            <div className="flex mt-6 mx-auto gap-4">
              <input required onChange={(e) => setModule(e.target.value)} value={module} className="shadow p-2" placeholder="Module Name" type="text" name="module" id="module" />
              <input required onChange={(e) => setSubject(e.target.value)} value={subject} className="shadow p-2" placeholder="Lesson Name" type="text" name="subject" id="subject" />
            </div>
          </div>
          <input className="hidden" type="text" value={extractedText} onChange={(e) => setExtractedText(e.target.value)} name="lesson" />
          <div className="flex justify-between">
            <button onClick={() => generateMcq(false)} type="button" className="mx-auto mt-10 px-5 py-3 font-semibold text-white rounded bg-zinc-900">Generate MCQ</button>
            <button onClick={() => generateMcq(true)} type="button" className="mx-auto mt-10 px-5 py-3 font-semibold text-white rounded bg-zinc-900">Generate Flashcards</button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="ml-8 mt-8">
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
          {/* { (quiz.length > 0 || flashcards.length > 0) && 
            <div className="mx-auto mt-4">
              
            </div>
          } */}
          <div className="mx-auto mt-4">
            <h2 className="text-4xl flex justify-center font-semibold p-6 text-white font-serif">Questions: </h2>
            {quiz.length > 0 && <p className="p-4 text-white">Number of questions: {quiz.length}</p>}
            {type && quiz.length > 4 ? quiz.map((question: MCQ, index: number) => (
              <div key={index} className="mb-10">
                <div className="flex justify-center bg-white p-4 w-[600px] rounded">
                  <h3>{question.question}</h3>
                </div>
                <div className="flex flex-col gap-3 mt-4 mb-4 justify-center">
                  {question.options.map((option: string, optionIndex: number) => (
                    <button
                      key={optionIndex}
                      type="button"
                      className={`px-8 py-3 w-[600px] rounded text-white font-semibold 
                        ${answersArray[index] && answersArray[index].includes(optionIndex) ? 'bg-zinc-400 text-zinc-900' : 'bg-zinc-900'} 
                        ${correctedQuestions[index] && (correctionArray[index][optionIndex] ? "bg-green-800" : "bg-red-800")}
                      `}
                      onClick={() => handleButtonClick(optionIndex, index)}
                    >
                    {option}
                  </button>
                  ))}
                </div>
                <button onClick={() => handleCorrections(index)} type="button" className="mx-auto flex px-5 py-3 font-semibold text-white rounded bg-zinc-900">Correction</button>
              </div>
            )) 
            : 
            flashcards.map((question: Flashcard, index: number) => (
              <div key={index} className="mb-10">
                <div className="flex justify-center bg-white p-4 w-[600px] rounded">
                  <h3>{question.question}</h3>
                  <p>{question.answer}</p>
                </div>
              </div>
            ))}
              <p className="p-4 text-white font-mono">Nothing to show ;) Try uploading a PDF</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
