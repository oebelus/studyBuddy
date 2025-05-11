import { FC, useEffect } from 'react';

interface NavigationProps {
    currentIndex: number;
    totalQuestions: number;
    isSubmitted: boolean;
    isSample: boolean;
    onPrevious: () => void;
    onNext: () => void;
    onShowScore: () => void;
    onSaveQuiz: () => void;
}

export const Navigation: FC<NavigationProps> = ({
    currentIndex,
    totalQuestions,
    isSample,
    onPrevious,
    onNext,
    onShowScore,
    onSaveQuiz
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
            onNext();
        } else if (e.key === 'ArrowLeft') {
            onPrevious();
        }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNext, onPrevious])

    return (
        <div className="flex justify-between mt-6">
            <button
                onClick={onPrevious}
                disabled={currentIndex === 0}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all"
            >
                Previous
            </button>
            <div className="flex gap-2">
                {!isSample && currentIndex == totalQuestions - 1 && (
                    <button
                        onClick={onShowScore}
                        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all"
                    >
                        Check Your Score
                    </button>
                )}
                {isSample && (
                    <button 
                        className="bg-green-300 border-2 border-green-500 px-2 rounded-md text-green-700"
                        onClick={onSaveQuiz}
                    >
                        Save Quiz
                    </button>
                )}
                {currentIndex < totalQuestions - 1 && 
                    <button
                        onClick={onNext}
                        disabled={currentIndex === totalQuestions - 1}
                        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all"
                    >
                        Next
                    </button>
                }
            </div>
        </div>
    );
};