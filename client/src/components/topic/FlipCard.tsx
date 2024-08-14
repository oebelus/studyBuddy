import axios from "axios";
import { Flashcard } from "../../types/flashcard";

interface FlashcardProps {
    flashcards: Flashcard[] | undefined;
    title: string,
    category: string
}

export default function FlipCard({ flashcards, title, category }: FlashcardProps) {

    const saveFlashcards = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(
                `http://localhost:3000/api/quiz/flashcard`, 
                {
                    title,
                    category,
                    flashcards
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
        <div className="flex flex-col">
            <div className="flex justify-end mr-32">
                <button onClick={saveFlashcards} className="hover:bg-[#333] dark:hover:bg-gray-200 transition py-4 px-8 rounded-lg dark:bg-white bg-[#2D2D2D] text-white dark:text-black w-fit">
                    Save Flashcards
                </button>
            </div>
            
            <div className="flex h-[22%] flex-wrap gap-6 justify-center mt-10 px-8 overflow-y-scroll">
                {flashcards && flashcards.map((flashcard, key) => (
                    <div
                        key={key}
                        className="flip-card w-64 h-64 border rounded-lg"
                    >
                        <div className="flip-card-inner">
                            <div className="p-4 flip-card-front flex items-center justify-center bg-gray-200 dark:bg-[#333] text-black dark:text-white">
                                <p className="text-xl font-semibold overflow-auto">{flashcard.question}</p>
                            </div>
                            <div className="overflow-auto justify-start p-4 flip-card-back flex items-center bg-gray-800 dark:bg-white dark:text-black text-white">
                                <p className="text-xl font-semibold">{flashcard.answer}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
