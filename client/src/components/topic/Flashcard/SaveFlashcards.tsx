import axios from "axios";
import { Flashcard } from "../../../types/flashcard";

interface SaveProps {
    flashcards: Flashcard[];
    title: string,
    category: string,
}

export default function SaveFlashcard({title, category, flashcards}: SaveProps) {
    const save = async () => {
        const token = localStorage.getItem("accessToken");

        try {
            await axios.post(
                `http://localhost:3000/api/flashcard`, 
                {
                    title,
                    category,
                    flashcards
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
            window.location.reload()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error:', error.response.data.message || 'An error occurred');
            } else {
                console.error('Error:', (error as Error).message || 'An error occurred');
            }
        }
    };
    return (
        
        <div className="flex justify-end mr-32">
            <button onClick={save} className="hover:bg-[#333] dark:hover:bg-gray-200 transition py-4 px-8 rounded-lg dark:bg-white bg-[#2D2D2D] text-white dark:text-black w-fit">
                Save Flashcards
            </button>
        </div>
    )
}
