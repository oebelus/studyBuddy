import { FC } from 'react';

interface ScoreDisplayProps {
    score: number;
    totalQuestions: number;
    onSaveAttempt: () => void;
    onStartOver: () => void;
}

export const ScoreDisplay: FC<ScoreDisplayProps> = ({
    score,
    totalQuestions,
    onSaveAttempt,
    onStartOver
}) => {

    return (
        <div className="mt-6 text-center">
            <div className="text-lg font-semibold text-gray-700">
                Your score: {score}/{totalQuestions}
            </div>
            <div className="mt-6">
                <button
                    onClick={onSaveAttempt}
                    className="cursor-pointer bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all"
                >
                    Save Attempt
                </button>
                <button
                    onClick={onStartOver}
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all ml-2"
                >
                    Start Over
                </button>
            </div>
        </div>
    );
};