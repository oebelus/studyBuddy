import { Flashcard } from "../../../types/flashcard";

interface FlashcardProps {
    flashcards: Flashcard[] | undefined;
}

export default function FlipCard({ flashcards }: FlashcardProps) {
    return (
        <div className="flex flex-wrap gap-6 justify-center mt-10 px-8 overflow-y-scroll">
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
    );
}
