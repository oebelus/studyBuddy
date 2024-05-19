import axios from "axios";
import { useEffect, useState } from "react";
import { formatJson } from "./utils/formatJson";

type Answer = {
  1: boolean,
  2: boolean,
  3: boolean,
  4: boolean,
}

function App() {
  const [extractedText, setExtractedText] = useState<string | undefined>('')
  const [quiz, setQuiz] = useState<unknown[]>([])
  const [answersArray, setAnswersArray] = useState<Record<number, number[]>>({})
  const [correctionArray, setCorrectionArray] = useState<Record<number, Answer>>({})
  const [corrected, setCorrected] = useState<boolean>(false)
  const [questionId, setQuestionId] = useState<number | undefined>(undefined)
  const [correctedQuestions, setCorrectedQuestions] = useState<Record<number, boolean>>({})
  
  useEffect(() => {
    const initialAnswersArray: Record<number, number[]> = {};
    const initialCorrectionArray: Record<number, Answer> = {};
    const initialCorrectedQuestions: Record<number, boolean> = {};

    for (let i = 0; i < quiz.length; i++) {
      initialAnswersArray[i] = [];
      initialCorrectedQuestions[i] = false

      initialCorrectionArray[i] = {
        1: (parseInt(quiz[i].answers[0]) == 1),
        2: (parseInt(quiz[i].answers[0]) == 2),
        3: (parseInt(quiz[i].answers[0]) == 3),
        4: (parseInt(quiz[i].answers[0]) == 4),
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
  }, [correctedQuestions]);

  
  async function handlePdf(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("clicked")
    const selectedFile = e.target.files![0]
    const formData = new FormData()
    formData.append('pdf', selectedFile, selectedFile!.name)

    await axios.post(`http://localhost:3000/upload-pdf`, formData)
      .then((response) => setExtractedText(response.data.extractedText))
      .catch((error) => console.log(error))
  }

  function generateMcq() {
    axios.get(`http://localhost:3000/api/questions?lesson=${encodeURIComponent(extractedText!)}`)
      .then((response) => {
        try {
          const ans = response.data.aiResponse;
          console.log(JSON.parse(formatJson(ans).toString()).questions)
          setQuiz(JSON.parse(formatJson(ans).toString()).questions)
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      })
      .catch((error) => console.log(error))
  }

  return (
    <div className={`bg-zinc-800 ${quiz.length > 0 ? "h-full" : "h-screen"}`}>
      <h1 className="text-5xl flex justify-center font-semibold p-6 text-white font-serif">PDF to MCQ Generator</h1>
      <div className="flex flex-col justify-center">
        <div className="bg-white w-fit h-fit p-3 rounded mx-auto mt-4">
          <div>
            <p className="text-black font-semibold text-xl mb-5">Select File:</p>
            <input onChange={handlePdf} type="file" name="pdf" id="pdf" accept="application/pdf" />
          </div>
          <input className="hidden" type="text" value={extractedText} onChange={(e) => setExtractedText(e.target.value)} name="lesson" />
          <div className="flex justify-between">
            <button onClick={generateMcq} type="button" className="mx-auto mt-10 px-5 py-3 font-semibold text-white rounded bg-zinc-900">Generate MCQ</button>
          </div>
        </div>
        <div className="mx-auto mt-4">
          <h2 className="text-4xl flex justify-center font-semibold p-6 text-white font-serif">Questions: </h2>
          {quiz.length > 0 && <p className="p-4 text-white">Number of questions: {quiz.length}</p>}
          {quiz.length > 4 ? quiz.map((question: unknown, index: number) => (
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
                      ${correctedQuestions[index] && (correctionArray[index][optionIndex.toString()] ? "bg-green-800" : "bg-red-800")}
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
          <div>
            <p className="p-4 text-white font-mono">Nothing to show ;) Try uploading a PDF</p>
          </div>}
        </div>
      </div>
    </div>
  )
}

export default App
