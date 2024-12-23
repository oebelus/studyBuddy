import { useState } from "react";
import { Flashcard } from "../../../types/flashcard";

interface FlashcardProps {
    flashcards: Flashcard[] | undefined;
}

export default function FlipCard({ flashcards }: FlashcardProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [grades, setGrades] = useState<{ [key: number]: string }>({});

    if (!flashcards || flashcards.length === 0) {
        return <p>No flashcards available</p>;
    }

    const handleGrade = (grade: string) => {
        setGrades({ ...grades, [currentIndex]: grade });
        goToNextCard();
    };

    const goToNextCard = () => {
        setShowAnswer(false);
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const goToPreviousCard = () => {
        setShowAnswer(false);
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const currentCard = flashcards[currentIndex];

    return (
        <div className="flex flex-col items-center gap-6 mt-10 px-8">
            {/* Card Container */}
            <div
                className="text-center w-[80%] max-w-3xl h-96 border rounded-lg cursor-pointer flex items-center justify-center relative"
                onClick={() => setShowAnswer(!showAnswer)}
            >
                {/* Question Side */}
                {!showAnswer && (
                    <div className="w-full h-full flex items-center justify-center border-[#1F1F1F] border-2 bg-gray-200 text-black p-6 rounded-lg">
                        <p className="text-2xl font-semibold">{currentCard.question}</p>
                        <p className="underline absolute bottom-4">Click to Display the Answer</p>
                    </div>
                )}

                {/* Answer Side */}
                {showAnswer && (
                    <div className="w-full h-full flex items-center justify-center bg-[#1F1F1F] text-white p-6 rounded-lg">
                        <p className="text-2xl font-semibold">{currentCard.answer}</p>
                        <p className="underline absolute bottom-4">Click to Hide the Answer</p>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={goToPreviousCard}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
                    disabled={currentIndex === 0}
                >
                    Previous
                </button>
                <button
                    onClick={goToNextCard}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
                    disabled={currentIndex === flashcards.length - 1}
                >
                    Next
                </button>
            </div>

            {/* Grade Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={() => handleGrade("Easy")}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Easy
                </button>
                <button
                    onClick={() => handleGrade("Medium")}
                    className="px-4 py-2 bg-yellow-500 text-white rounded"
                >
                    Medium
                </button>
                <button
                    onClick={() => handleGrade("Hard")}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                >
                    Hard
                </button>
            </div>

            {/* Status Display */}
            <div className="mt-4 text-center">
                <p>
                    Card {currentIndex + 1} of {flashcards.length}
                </p>
                <p>
                    Status: {grades[currentIndex] ? grades[currentIndex] : "Not graded"}
                </p>
            </div>
        </div>
    );
}
