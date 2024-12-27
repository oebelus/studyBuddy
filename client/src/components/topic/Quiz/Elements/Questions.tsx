import { useState } from "react";
import { uuid } from "uuidv4";
import { MCQs } from "../../../../types/mcq";
import SaveQuiz from "../SaveQuiz";
import { axiosInstance } from "../../../../services/auth.service";
import { useLocation } from "react-router-dom";

interface QuestionsProps {
    mcq: MCQs;
    userId: string;
    answers: { [key: number]: boolean };
    setAnswers: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>;
}

export default function Questions({ mcq, userId, answers, setAnswers }: QuestionsProps) {
    const [showScore, setShowScore] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number[] }>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [attempt, setAttempt] = useState(0);
    const [answered, setAnswered] = useState(0);
    const [editingOption, setEditingOption] = useState<{ index: number; text: string; isCorrect: boolean } | null>(null);
    const [savingQuestion, setSavingQuestion] = useState(false);

    const isSample = useLocation().pathname === '/quiz-sample';

    const handleEditOption = (index: number) => {
        const currentQuestion = mcq.mcqs[currentQuestionIndex];
        const optionText = currentQuestion.options[index];
        const isCorrect = currentQuestion.answers.includes(index);

        setEditingOption({
            index,
            text: optionText,
            isCorrect,
        });
    };

    const handleSaveOption = () => {
        if (editingOption) {
            const { index, text, isCorrect } = editingOption;
            const currentQuestion = mcq.mcqs[currentQuestionIndex];

            // Update the option text
            currentQuestion.options[index] = text;

            // Update the correct answer status
            if (isCorrect) {
                if (!currentQuestion.answers.includes(index)) {
                    currentQuestion.answers.push(index);
                }
            } else {
                currentQuestion.answers = currentQuestion.answers.filter((answerIndex) => answerIndex !== index);
            }

            setEditingOption(null); // Close editing mode
        }
    };

    const handleSubmit = () => {
        const currentQuestion = mcq.mcqs[currentQuestionIndex];
        const selectedForThisQuestion = selectedOptions[currentQuestion.id] || [];
        const isCorrect = selectedForThisQuestion.sort().toString() === currentQuestion.answers.sort().toString();

        setIsSubmitted(true);
        setAnswered(x => x + 1);
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [currentQuestionIndex]: isCorrect
        }));

        if (isCorrect) {
            setScore((prev) => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < mcq.mcqs.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsSubmitted(false);
            setSelectedOptions({});
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setIsSubmitted(false);
        }
    };

    const handleStartOver = () => {
        setSelectedOptions({});
        setIsSubmitted(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowScore(false);
        setAnswers({});
    };

    const isCorrectAnswer = (index: number) => {
        return mcq.mcqs[currentQuestionIndex].answers.includes(index);
    };

    const isOptionSelected = (questionId: number) => {
        return (selectedOptions[questionId] || []).length > 0;
    };

    const handleShowScore = async () => {
        setShowScore(true);
    };

    const handleOptionClick = (index: number) => {
        const currentQuestionId = mcq.mcqs[currentQuestionIndex].id;
        setSelectedOptions((prev) => {
            const selectedForThisQuestion = prev[currentQuestionId] || [];
            if (selectedForThisQuestion.includes(index)) {
                return {
                    ...prev,
                    [currentQuestionId]: selectedForThisQuestion.filter((option) => option !== index),
                };
            } else {
                return {
                    ...prev,
                    [currentQuestionId]: [...selectedForThisQuestion, index],
                };
            }
        });
    };

    const handleSaveAttempt = async () => {
        setAnswers(answers);
        setAttempt(answered);

        const mcqAttempt = {
            mcqAttempts: {
                userId,
                mcqSetId: mcq._id || uuid(),
                title: mcq.title,
                numberOfQuestions: mcq.mcqs.length,
                score,
                answers,
                timestamp: new Date(),
            },
        };

        try {
            const response = await axiosInstance.post("/attempt/mcq", mcqAttempt);
            setAttempt(2);
            setTimeout(() => {
                setAttempt(0);
            }, 3000);
        } catch (error) {
            setAttempt(3);
            setTimeout(() => {
                setAttempt(0);
            }, 3000);
        }
    };

    const currentQuestion = mcq.mcqs[currentQuestionIndex];

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            {editingOption && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Edit Option</h2>
                        <input
                            type="text"
                            value={editingOption.text}
                            onChange={(e) => setEditingOption((prev) => (prev ? { ...prev, text: e.target.value } : null))}
                            className="w-full p-2 border rounded-lg mb-4"
                        />
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={editingOption.isCorrect}
                                onChange={(e) =>
                                    setEditingOption((prev) => (prev ? { ...prev, isCorrect: e.target.checked } : null))
                                }
                            />
                            Is Correct
                        </label>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setEditingOption(null)}
                                className="bg-gray-300 px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveOption}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {!showScore ? (
                <div>
                    <h3 className="text-xl font-semibold mb-6 text-gray-700">
                        Question {currentQuestionIndex + 1} of {mcq.mcqs.length}
                    </h3>
                    <p className="text-lg mb-4 text-gray-600">{currentQuestion.question}</p>
                    <div className="space-y-4 mb-6">
                        {currentQuestion.options.map((option, index) => (
                            <div
                                key={index}
                                onClick={() => handleOptionClick(index)}
                                className={`justify-between flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                    isSubmitted
                                        ? isCorrectAnswer(index)
                                            ? "border-green-500 bg-green-50"
                                            : "border-red-500 bg-red-50"
                                        : selectedOptions[currentQuestion.id]?.includes(index)
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300 hover:border-gray-500"
                                }`}
                            >
                                <label
                                    className={`text-lg transition-all ${
                                        isSubmitted
                                            ? isCorrectAnswer(index)
                                                ? "text-green-600"
                                                : "text-red-600"
                                            : selectedOptions[currentQuestion.id]?.includes(index)
                                            ? "text-blue-600"
                                            : "text-gray-800"
                                    }`}
                                >
                                    {option}
                                </label>
                                <button onClick={() => handleEditOption(index)}>
                                    <span className="material-symbols-outlined hover:bg-gray-200 p-2 rounded-lg">edit</span>
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={!isOptionSelected(currentQuestion.id) || isSubmitted || answers[currentQuestionIndex] !== undefined}
                        className="mt-4 bg-blue-500 py-3 px-6 rounded-lg w-full text-lg text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-all"
                    >
                        Submit
                    </button>
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all"
                        >
                            Previous
                        </button>
                        <div className="flex gap-2">
                            {!isSample && <button
                                onClick={handleShowScore}
                                disabled={!isSubmitted}
                                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all"
                            >
                                Check Your Score
                            </button>}
                            { isSample && 
                            <button className="bg-green-300 border-2 border-green-500 px-2 rounded-md text-green-700">
                                Save Question
                            </button> }
                            <button
                                onClick={handleNext}
                                disabled={currentQuestionIndex === mcq.mcqs.length - 1}
                                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-6 text-center">
                    <div className="text-lg font-semibold text-gray-700">
                        Your score: {score}/{mcq.mcqs.length}
                    </div>
                    <div className="mt-6">
                        <button
                            onClick={handleSaveAttempt}
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all"
                        >
                            Save Attempt
                        </button>
                        <button
                            onClick={handleStartOver}
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all ml-2"
                        >
                            Start Over
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
