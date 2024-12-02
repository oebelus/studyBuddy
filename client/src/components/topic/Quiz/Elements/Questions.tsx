import { useEffect, useState } from "react";
import { uuid } from "uuidv4";
import { MCQs } from "../../../../types/mcq";
import SaveQuiz from "../SaveQuiz";
import { axiosInstance } from "../../../../services/auth.service";

interface QuestionsProps {
    mcq: MCQs;
    userId: string;
    answers: {[key: number]: boolean};
    setAnswers: React.Dispatch<React.SetStateAction<{[key: number]: boolean}>>;
}

export default function Questions({ mcq, userId, answers, setAnswers }: QuestionsProps) {
    const [showScore, setShowScore] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number[] }>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    const handleSubmit = () => {
        const currentQuestion = mcq.mcqs[currentQuestionIndex];
        const selectedForThisQuestion = selectedOptions[currentQuestion.id] || [];
        const isCorrect = selectedForThisQuestion.sort().toString() === currentQuestion.answers.sort().toString();

        setIsSubmitted(true);
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

    const handleOptionChange = (index: number) => {
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

    useEffect(() => {
        console.log("answers", answers)
    }, [answers])

    const handleSaveAttempt = async () => {
        setAnswers(answers);

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
        }

        // console.log(mcqAttempt)
        try {
            const response = await axiosInstance.post("/attempt/mcq", mcqAttempt);
            console.log("MCQ attempt saved successfully:", response.data);
        } catch (error) {
            console.error("Failed to save MCQ attempt:", error);
        }
    };

    const currentQuestion = mcq.mcqs[currentQuestionIndex];

    return (
        <div>
            <SaveQuiz category={mcq.category} title={mcq.title} mcqs={mcq.mcqs}/>
            {!showScore ? (
                <div>
                    <h3 className="text-xl font-semibold mb-6">
                        Question {currentQuestionIndex + 1} of {mcq.mcqs.length}
                    </h3>
                    <p className="text-lg mb-4">{currentQuestion.question}</p>
                    <div className="space-y-4 mb-6">
                        {currentQuestion.options.map((option, index) => (
                            <div
                                key={index}
                                className={`flex items-center p-3 rounded-lg border ${
                                    isSubmitted
                                        ? isCorrectAnswer(index)
                                            ? "border-green-500"
                                            : "border-red-500"
                                        : "border-gray-300"
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    id={`option-${index}`}
                                    disabled={isSubmitted}
                                    checked={(selectedOptions[currentQuestion.id] || []).includes(index)}
                                    onChange={() => handleOptionChange(index)}
                                    className="mr-3"
                                />
                                <label
                                    htmlFor={`option-${index}`}
                                    className={`text-lg dark:text-white ${
                                        isSubmitted
                                            ? isCorrectAnswer(index)
                                                ? "text-green-600"
                                                : "text-red-600"
                                            : "text-gray-800"
                                    }`}
                                >
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={!isOptionSelected(currentQuestion.id) || isSubmitted}
                        className={`mt-4 bg-blue-500 text-white dark:bg-[#111111] dark:hover:bg-[#0f0f0f] py-3 px-6 rounded-lg w-full text-lg ${
                            isSubmitted || !isOptionSelected(currentQuestion.id)
                                ? "bg-gray-200 cursor-not-allowed"
                                : "hover:bg-blue-600"
                        }`}
                    >
                        Submit
                    </button>
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className={`bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 ${currentQuestionIndex === 0 ? "cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            Previous
                        </button>
                        {currentQuestionIndex + 1 === mcq.mcqs.length && isSubmitted ? (
                            <button
                                onClick={handleShowScore}
                                disabled={!isSubmitted}
                                className={`bg-gray-500 text-white py-2 px-4 rounded-lg ${
                                    isSubmitted ? "bg-green-500 hover:bg-green-600" : "cursor-not-allowed"
                                }`}
                            >
                                Check Your Score
                            </button>
                        ) : (
                            <div className="flex gap-4">
                                <button
                                    onClick={handleNext}
                                    disabled={currentQuestionIndex === mcq.mcqs.length - 1}
                                    className={`text-white py-2 px-4 rounded-lg cursor-pointer ${currentQuestionIndex === mcq.mcqs.length - 1 ? "cursor-not-allowed bg-gray-500 text-white" : "Next bg-green-500 hover:bg-green-600"}`}
                                >
                                    Next
                                </button>
                                    <button
                                    onClick={handleShowScore}
                                    className="text-white py-2 px-4 rounded-lg cursor-pointer bg-blue-500 hover:bg-blue-600"
                                >
                                    Display Score
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="mt-6 text-center">
                    <div className="text-lg font-semibold">
                        Your score: {score}/{mcq.mcqs.length}
                    </div>
                    <div className="flex gap-4 justify-center mt-4">
                        <button
                            onClick={handleStartOver}
                            className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-lg"
                        >
                            Start Over
                        </button>
                        <button
                            onClick={handleSaveAttempt}
                            className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-lg"
                        >
                            Save Attempt
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
