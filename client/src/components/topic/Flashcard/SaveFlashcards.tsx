import { axiosInstance } from "../../../services/auth.service";
import { Flashcard } from "../../../types/flashcard";

interface SaveProps {
    flashcards: Flashcard[];
    title: string,
    category: string,
}

export default function SaveFlashcard({title, category, flashcards}: SaveProps) {
    const save = async () => {
        try {
            await axiosInstance.post(
                `http://localhost:3000/api/flashcard`, 
                {
                    title,
                    category,
                    flashcards
                })
                
            window.location.reload()
        } catch (error) {
            console.log(error)
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
