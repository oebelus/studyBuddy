import axios from "axios";
import { MCQ } from "../../../types/mcq";
import { useState } from "react";

interface SaveProps {
    mcqs: MCQ[] | undefined;
    title: string,
    category: string,
}

export default function SaveQuiz({title, category, mcqs}: SaveProps) {
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const save = async () => {
        const token = localStorage.getItem("token");
        setLoading(true)

        try {
            await axios.post(
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
            setSaved(true);
        } catch (error) {
            setLoading(false)
            if (axios.isAxiosError(error) && error.response) {
                setError(true)
                console.error('Error:', error.response.data.message || 'An error occurred');
            } else {
                setError(true)
                console.error('Error:', (error as Error).message || 'An error occurred');
            }
        }
    };
    return (
        
        <div className="flex justify-end mr-32">
            <button onClick={save} className={`hover:bg-[#333] dark:hover:bg-gray-200 transition py-4 px-8 rounded-lg dark:bg-white bg-[#2D2D2D] text-white dark:text-black w-fit ${loading ? "cursor-not-allowed bg-gray-500" : saved? "cursor-not-allowed bg-green-500" : error ? "cursor-not-allowed bg-red-500" : ""}`}>
                {loading ? "Saving..." : error ? "Error" : saved ? "Saved" : "Save"}
            </button>
        </div>
    )
}