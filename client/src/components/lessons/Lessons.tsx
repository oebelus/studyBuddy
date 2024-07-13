import { useEffect, useState } from "react"
import axiosInstance from "../../api/instances"
import { MCQ } from "../../types/output"

export default function Lessons({clicked}: {clicked: string}) {
    const [quiz, setQuiz] = useState<MCQ>()

    useEffect(() => {
        axiosInstance.get(`/quiz/mcq/${clicked}`)
            .then((response) =>{
                console.log(response.data);
                setQuiz(quiz)
            })
    }, [clicked, quiz])

    return (
        <div className='p-4'>
            <h1 className='mb-2 mt-0 text-4xl font-medium dark:text-gray-300'>{clicked}</h1>
            <div>
                <h3 className='dark:text-gray-300'>Notes:</h3>
                <div className='dark:bg-[#1F1F1F] dark:text-gray-300 bg-[#D1D5DB] p-4 m-4 w-[90%] rounded-lg'>
                    You have no notes;
                </div>
            </div>
            <div>
                <h3 className='dark:text-gray-300'>Quiz:</h3>
                <div className='dark:bg-[#1F1F1F] dark:text-gray-300 bg-[#D1D5DB] p-4 m-4 w-[90%] rounded-lg'>
                    You didn't generate any quiz;
                </div>
            </div>
            <div>
                <h3 className='dark:text-gray-300'>Flashcards:</h3>
                <div className='dark:bg-[#1F1F1F] dark:text-gray-300 bg-[#D1D5DB] p-4 m-4 w-[90%] rounded-lg'>
                    You didn't generate any flashcard;
                </div>
            </div>
        </div>
    )
}
