import { useEffect, useState } from "react";
import { Answer } from "../types/Answer";
import { Flashcard, MCQ, Output } from "../types/output";

interface QuizProps {
    quiz: MCQ[];
    flashcards: Flashcard[];
    type: Output;
}

export default function Quiz({ quiz, type, flashcards }: QuizProps) {
    const [correctionArray, setCorrectionArray] = useState<Record<number, Answer>>({});
    const [answersArray, setAnswersArray] = useState<Record<number, number[]>>({});
    const [correctedQuestions, setCorrectedQuestions] = useState<Record<number, boolean>>({});

    useEffect(() => {
        const initialAnswersArray: Record<number, number[]> = {};
        const initialCorrectionArray: Record<number, Answer> = {};
        const initialCorrectedQuestions: Record<number, boolean> = {};

        for (let i = 0; i < quiz.length; i++) {
            initialAnswersArray[i] = [];
            initialCorrectedQuestions[i] = false;

            initialCorrectionArray[i] = {
                0: quiz[i].answers.includes(0),
                1: quiz[i].answers.includes(1),
                2: quiz[i].answers.includes(2),
                3: quiz[i].answers.includes(3),
                4: quiz[i].answers.includes(4),
            };
        }

        setAnswersArray(initialAnswersArray);
        setCorrectionArray(initialCorrectionArray);
        setCorrectedQuestions(initialCorrectedQuestions);
    }, [quiz]);

    function handleButtonClick(optionIndex: number, id: number) {
        const updatedArray = { ...answersArray };

        if (updatedArray[id].includes(optionIndex)) {
            const index = updatedArray[id].indexOf(optionIndex);
            updatedArray[id].splice(index, 1);
        } else {
            updatedArray[id].push(optionIndex);
        }

        setAnswersArray(updatedArray);
    }

    function handleCorrections(id: number) {
        const updatedArray = { ...correctedQuestions };
        updatedArray[id] = !updatedArray[id];
        setCorrectedQuestions(updatedArray);
    }

    return (
        <div className="mx-auto xs:max-w-[60%] max-w-[90%] mt-4">
            {quiz.length > 0 && type === "quiz" && <p className="p-4 text-white">Number of questions: {quiz.length}</p>}
            {flashcards.length > 0 && type === "flashcard" && <p className="p-4 text-white">Number of questions: {flashcards.length}</p>}
            <div className="overflow-auto max-h-[400px] md:max-h-[600px]">
                {type === "quiz" && quiz.length > 4 && quiz.map((question: MCQ, index: number) => (
                    <div key={index} className="mb-10">
                        <div className="bg-white rounded md:w-[550px] ">
                            <h3 className="px-4 py-3">{question.id + 1}. {question.question}</h3>
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
                        <button onClick={() => handleCorrections(index)} type="button" className="mx-auto flex px-5 py-3 font-semibold dark:text-black bg-white rounded">Correction</button>
                    </div>
                ))}
            </div>
            <div className="overflow-auto max-h-[400px] md:max-h-[600px]">
                {flashcards.length > 0 && type === "flashcard" &&
                    flashcards.map((question: Flashcard, index: number) => (
                        <div key={index} className="max-w-lg mt-6 bg-white p-4 rounded shadow">
                            <div className="divide-y divide-gray-100">
                                <details className="group">
                                    <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-medium text-secondary-900 group-open:text-primary-500">
                                        {question.question}
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="block h-5 w-5 group-open:hidden">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hidden h-5 w-5 group-open:block">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                            </svg>
                                        </div>
                                    </summary>
                                    <div className="pb-4 text-secondary-500 bg-zinc-200 p-4 rounded">{question.answer}</div>
                                </details>
                            </div>
                        </div>
                    ))}
            </div>
            {((quiz.length === 0 || flashcards.length === 0)) && <p className="p-4 text-white font-mono mt-10">Try Generating MCQs or Flashcards :D</p>}
        </div>
    );
}
