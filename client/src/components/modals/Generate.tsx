import Modal from 'react-modal';
import { customStyles } from './modalUtils/styles';
import { formatJson } from '../../utils/format';
import { Dispatch, SetStateAction, useState } from 'react';
import { MCQ } from '../../types/mcq';
import { Flashcard } from '../../types/flashcard';
import { Output } from '../../types/output';
import { axiosInstance } from '../../services/auth.service';

interface GenerateType {
    modalIsOpen: boolean;
    setIsOpen: (el:boolean) => void;
    titles: string[],
    setQuiz: Dispatch<SetStateAction<MCQ[]>>
    quiz: MCQ[];
    setFlashcards: Dispatch<SetStateAction<Flashcard[]>>
    flashcards: Flashcard[];
    type: string; 
    setType: Dispatch<SetStateAction<Output>>;
    setLoading: (b: boolean) => void
}

export default function Generate({setLoading, modalIsOpen, setIsOpen, titles, setQuiz, quiz, setFlashcards, flashcards, type, setType}: GenerateType) {
    const [n, setN] = useState<number>(20)
    const [extractedText, setExtractedText] = useState<string | undefined>('')
    const [pdfName, setPDFName] = useState<string | undefined>('')
    
    const [subject, setSubject] = useState<string>("")

    function generateMcq(types: Output) {
    setLoading(true);
    setType(types)
    console.log(type)
    axiosInstance.get(`/quiz?lesson=${encodeURIComponent(extractedText!)}&module=${encodeURIComponent(subject)}&subject=${encodeURIComponent(subject)}&type=${encodeURIComponent(type)}&n=${encodeURIComponent(n)}`)
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

    async function handlePdf(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files![0]
        const formData = new FormData()
        formData.append('pdf', selectedFile, selectedFile!.name)

        await axiosInstance.post(`http://localhost:3000/api/upload-pdf`, formData)
        .then((response) => {
            setExtractedText(response.data.extractedText)
            setPDFName(response.data.pdfName)
            console.log(extractedText ? "is there" : "no text", pdfName)
            })
        .catch((error) => console.log(error))
    }

    function closeModal() {
        setIsOpen(false);
    }
    
    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <span onClick={closeModal} className="cursor-pointer material-symbols-outlined">
                close
            </span>
            <div className="mx-auto bg-white h-fit p-3 rounded-lg">
                <div className="flex flex-col justify-between items-center">
                    <div>
                        <p className="text-black font-mono font-semibold text-3xl">Generate:</p>
                    </div>
                
                    <div className="flex flex-col mt-6 gap-4 justify-items-center w-full">
                        <div className='flex gap-4'>
                            <label htmlFor="">Select a PDF:</label>
                            <input onChange={handlePdf} type="file" name="pdf" id="pdf" accept="application/pdf" />
                        </div>
                        <div className='flex sm:flex-row flex-col gap-4'>
                            <select onChange={(e) => setSubject(e.target.value)} className='w-[250px] px-4 py-2 bg-white text-black border border-black rounded-lg focus:outline-none'>
                                {titles && titles.length > 0 && titles.map((title, key) => (
                                <option key={key} value={title}>
                                    {title}
                                </option>
                                ))}
                            </select>
                            
                            <input
                                id="numQuestions"
                                type="number"
                                min="1"
                                max="50"
                                value={n}
                                onChange={(e) => setN(parseInt(e.target.value))}
                                className="w-[250px] px-4 py-2 bg-white text-black border border-black rounded-lg focus:outline-none"
                            />
                            <input className="hidden" type="text" value={extractedText} onChange={(e) => setExtractedText(e.target.value)} name="lesson" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => {generateMcq("quiz"), setIsOpen(false)}} type="button" className=" border-zinc-300 border-2 mt-4 px-5 py-3 font-semibold text-zinc-900 rounded bg-white hover:bg-zinc-200 transition">MCQs</button>
                        <button onClick={() => {generateMcq("flashcard"), setIsOpen(false)}} type="button" className=" border-zinc-300 border-2 mt-4 px-5 py-3 font-semibold text-zinc-900 rounded bg-white hover:bg-zinc-200 transition">Flashcards</button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
