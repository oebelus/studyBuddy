import { useEffect, useState } from "react";
import axiosInstance from "../../api/instances";
import { Flashcard, MCQ, Output } from "../../types/output";
import Generate from "../modals/Generate";
import Quiz from "../Quiz";
import Note from "./notes/Note";

interface LessonsType {
    lessons: string[];
    clicked: string;
}

export default function Lessons({ clicked, lessons }: LessonsType) {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [quiz, setQuiz] = useState<MCQ[] | null>(null);
    const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
    const [type, setType] = useState<Output>("quiz");
    const [loading, setLoading] = useState(false)

    function openModal() {
        setIsOpen(true);
    }

    useEffect(() => {
        axiosInstance.get(`/quiz/mcq/${clicked}`)
            .then((response) => {
                console.log(response.data);
                setQuiz(response.data);
            })
            .catch((error) => {
                console.error("Error fetching quiz data:", error);
            });
    }, [clicked]);

    return (
        <div className='p-4'>
            <h1 className='mb-2 mt-0 text-4xl font-medium dark:text-gray-300'>{clicked}</h1>
            <div className='p-4 flex gap-10'>
                <div>
                    <div>
                        <h3 className='dark:text-gray-300'>Notes:</h3>
                        <div className='flex justify-between dark:bg-[#1F1F1F] dark:text-gray-300 bg-[#D1D5DB] p-4 m-4 w-[90%] rounded-lg'>
                            <p>You have no notes;</p>
                            <button>
                                <span className="navigation material-symbols-outlined dark:text-white">
                                    edit
                                </span>
                            </button>
                        </div>
                    </div>
                    <div>
                        <h3 className='dark:text-gray-300'>Quiz:</h3>
                        {
                            loading ? 
                            <button type="submit">{loading ? <div className="w-16 h-16 mx-auto mt-5 border-4 border-dashed rounded-full animate-spin border-white"></div> : "<>Search</>"}</button>
                            :
                            <div>
                                <div className='flex justify-between dark:bg-[#1F1F1F] dark:text-gray-300 bg-[#D1D5DB] p-4 m-4 w-[90%] rounded-lg'>
                                    <p>You didn't generate any quiz or flashcards;</p>
                                    <button onClick={openModal}>
                                        <span className="navigation material-symbols-outlined dark:text-white">
                                            cycle
                                        </span>
                                    </button>       
                                </div>
                            </div>
                        }
                        <Quiz quiz={quiz || []} flashcards={flashcards || []} type={type} />
                    </div>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    { /* @ts-ignore */ }
                    <Generate setLoading={setLoading} type={type} setType={setType} setQuiz={setQuiz} setFlashcards={setFlashcards} quiz={quiz} flashcards={flashcards} titles={lessons} modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
                    
                </div>
                <div>
                    <Note id={""} content={""} onDelete={function (): void {
                        throw new Error("Function not implemented.");
                    } } />
                </div>
            </div>
        </div>
    );
}
