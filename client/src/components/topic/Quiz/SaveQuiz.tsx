import axios from "axios";
import { MCQ } from "../../../types/mcq";

interface SaveProps {
    mcqs: MCQ[] | undefined;
    title: string,
    category: string,
}

export default function SaveQuiz({title, category, mcqs}: SaveProps) {
    const save = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(
                `http://localhost:3000/api/quiz/mcq`, 
                {
                    title,
                    category,
                    mcqs
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Add the token to headers
                    }
                });
            console.log(response.data.message); // Log the success message
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // Handle known errors from the server
                console.error('Error:', error.response.data.message || 'An error occurred');
            } else {
                // Handle other errors (e.g., network issues)
                console.error('Error:', (error as Error).message || 'An error occurred');
            }
        }
    };
    return (
        
        <div className="flex justify-end mr-32">
            <button onClick={save} className="hover:bg-[#333] dark:hover:bg-gray-200 transition py-4 px-8 rounded-lg dark:bg-white bg-[#2D2D2D] text-white dark:text-black w-fit">
                Save Quiz
            </button>
        </div>
    )
}
