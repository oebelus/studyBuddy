import { useState, FC } from "react";
import { AddingOption, EditingOption } from "../../../../../types/mcq";
import { axiosInstance } from "../../../../../services/auth.service";
import { EditOptionModal } from "./EditOption";
import { ScoreDisplay } from "./DisplayScore";
import { AddOptionModal } from "./AddOption";
import { QuestionOption } from "./QuestionOption";
import { Navigation } from "./Navigation";
import { useLocation, useNavigate } from "react-router-dom";

interface QuestionsProps {
    mcq: {
        _id?: string;
        title: string;
        category: string;
        mcqs: {
            id: string;
            question: string;
            options: string[];
            answers: number[];
            answered: boolean;
        }[];
    };
    userId: string;
    answers: Record<number, boolean>;
    setAnswers: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}

const Questions: FC<QuestionsProps> = ({ mcq, userId, answers, setAnswers }) => {
    const [showScore, setShowScore] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, number[]>>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [, setAnswered] = useState<number>(0);
    const [editingOption, setEditingOption] = useState<EditingOption | null>(null);
    const [addingOption, setAddingOption] = useState<AddingOption | null>(null);
    const [, setSavingQuestion] = useState<boolean>(false);

    const isSample = useLocation().pathname === '/quiz-sample';

    const navigate = useNavigate();

    const handleOptionClick = (index: number): void => {
        const currentQuestion = mcq.mcqs[currentQuestionIndex];
        const selectedForThisQuestion = selectedOptions[currentQuestion.id as string] || [];
        const isSelected = selectedForThisQuestion.includes(index);

        setSelectedOptions(prev => ({
            ...prev,
            [currentQuestion.id as string]: isSelected
                ? selectedForThisQuestion.filter(i => i !== index)
                : [...selectedForThisQuestion, index]
        }));
    };

    const handleEditOption = (index: number): void => {
        const currentQuestion = mcq.mcqs[currentQuestionIndex];
        setEditingOption({
            index,
            text: currentQuestion.options[index],
            isCorrect: currentQuestion.answers.includes(index)
        });
    };

    const handleSaveOption = (): void => {
        if (!editingOption) return;
        const currentQuestion = mcq.mcqs[currentQuestionIndex];
        const { index, text, isCorrect } = editingOption;

        currentQuestion.options[index] = text;
        currentQuestion.answers = isCorrect 
            ? [...new Set([...currentQuestion.answers, index])]
            : currentQuestion.answers.filter(i => i !== index);

        setEditingOption(null);
    };

    const handleAddOptionClick = (): void => {
        setAddingOption({ text: "", isCorrect: false });
    };

    const handleSaveNewOption = (): void => {
        if (!addingOption) return;
        const currentQuestion = mcq.mcqs[currentQuestionIndex];
        const newIndex = currentQuestion.options.length;
        
        currentQuestion.options.push(addingOption.text);
        if (addingOption.isCorrect) {
            currentQuestion.answers.push(newIndex);
        }
        
        setAddingOption(null);
    };

    const handleDeleteOption = (index: number, e: React.MouseEvent): void => {
        e.stopPropagation();
        const currentQuestion = mcq.mcqs[currentQuestionIndex];
        
        currentQuestion.options = currentQuestion.options.filter((_, i) => i !== index);
        currentQuestion.answers = currentQuestion.answers
            .filter(answerIndex => answerIndex !== index)
            .map(answerIndex => answerIndex > index ? answerIndex - 1 : answerIndex);
    };

    const handleSubmit = (): void => {
        const currentQuestion = mcq.mcqs[currentQuestionIndex];
        const selectedForThisQuestion = selectedOptions[currentQuestion.id as string] || [];
        const isCorrect = selectedForThisQuestion.sort().toString() === currentQuestion.answers.sort().toString();

        setIsSubmitted(true);
        setAnswered(prev => prev + 1);
        setAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: isCorrect
        }));

        if (isCorrect) setScore(prev => prev + 1);
    };

    const handleNext = (): void => {
        if (currentQuestionIndex < mcq.mcqs.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setIsSubmitted(false);
            setSelectedOptions({});
        }
    };

    const handlePrevious = (): void => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setIsSubmitted(false);
        }
    };

    const handleStartOver = (): void => {
        setSelectedOptions({});
        setIsSubmitted(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowScore(false);
        setAnswers({});
    };

    const isCorrectAnswer = (index: number): boolean => {
        return mcq.mcqs[currentQuestionIndex].answers.includes(index);
    };

    const handleShowScore = (): void => {
        setShowScore(true);
    };

    const handleSaveAttempt = async (): Promise<void> => {
        const mcqAttempt = {
            mcqAttempts: {
                userId,
                mcqSetId: mcq._id || uuidv4(),
                title: mcq.title,
                numberOfQuestions: mcq.mcqs.length,
                score,
                answers,
                timestamp: new Date(),
            },
        };

        try {
            await axiosInstance.post("/attempt/mcq", mcqAttempt);
            navigate("/quiz", { replace: true })
        } catch (error) {
            console.error("Failed to save attempt:", error);
        }
    };

    const handleSaveQuestion = async (): Promise<void> => {
        setSavingQuestion(true);
        
        try {
            await axiosInstance.post("/quiz", {
                title: mcq.title,
                category: mcq.category,
                mcqs: mcq.mcqs,
            });
        } catch (error) {
            console.error("Failed to save quiz:", error);
        } finally {
            setSavingQuestion(false);
            navigate('/quiz', {replace: true})
        }
    };

    if (showScore) {
        return (
            <ScoreDisplay
                score={score}
                totalQuestions={mcq.mcqs.length}
                onSaveAttempt={handleSaveAttempt}
                onStartOver={handleStartOver}
            />
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            {editingOption && (
                <EditOptionModal
                    editingOption={editingOption}
                    onClose={() => setEditingOption(null)}
                    onSave={handleSaveOption}
                    setEditingOption={setEditingOption}
                />
            )}

            {addingOption && (
                <AddOptionModal
                    addingOption={addingOption}
                    onClose={() => setAddingOption(null)}
                    onSave={handleSaveNewOption}
                    setAddingOption={setAddingOption}
                />
            )}

            <h3 className="text-xl font-semibold mb-6 text-gray-700">
                Question {currentQuestionIndex + 1} of {mcq.mcqs.length}
            </h3>

            <div className="mb-6">
                <p className="text-xl font-semibold text-gray-700">{mcq.mcqs[currentQuestionIndex].question}</p>
            </div>
            
            <div className="space-y-4 mb-6">
                {mcq.mcqs[currentQuestionIndex].options.map((option, index) => (
                    <QuestionOption
                        key={index}
                        option={option}
                        index={index}
                        isSubmitted={isSubmitted}
                        isCorrectAnswer={isCorrectAnswer(index)}
                        isSelected={selectedOptions[mcq.mcqs[currentQuestionIndex].id]?.includes(index)}
                        onOptionClick={() => handleOptionClick(index)}
                        onEditClick={() => handleEditOption(index)}
                        onDeleteClick={(e) => handleDeleteOption(index, e)}
                    />
                ))}
                
                <button
                    onClick={handleAddOptionClick}
                    className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-500 hover:text-gray-700 transition-all flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">add_circle</span>
                    Add Option
                </button>
            </div>

            <button
                onClick={handleSubmit}
                disabled={!selectedOptions[mcq.mcqs[currentQuestionIndex].id]?.length || isSubmitted || answers[currentQuestionIndex] !== undefined}
                className="mt-4 bg-blue-500 py-3 px-6 rounded-lg w-full text-lg text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-all"
            >
                Submit
            </button>

            <Navigation
                currentIndex={currentQuestionIndex}
                totalQuestions={mcq.mcqs.length}
                isSubmitted={isSubmitted}
                isSample={isSample}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onShowScore={handleShowScore}
                onSaveQuiz={handleSaveQuestion}
            />
        </div>
    );
};

export default Questions;

function uuidv4(): string | undefined {
    throw new Error("Function not implemented.");
}
