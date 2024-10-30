import React, { useEffect, useState } from "react";
import axios from "axios";
import { MCQs } from "../../../types/mcq";
import { uuid } from 'uuidv4';

type MCQSectionProps = {
  mode: "training" | "exam";
  mcq: MCQs | undefined;
};

const MCQSection: React.FC<MCQSectionProps> = ({ mode, mcq }) => {
  // Move all hooks to the top level
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number[] }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [answers, setAnswers] = useState<Array<{
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
  }>>([]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
        
        const response = await axios.get("http://localhost:3000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserId(response.data.user._id);
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    console.log(userId);
  }, [userId]);

  const handleOptionChange = (index: number) => {
    if (!mcq) return;
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

  const handleSubmit = () => {
    if (!mcq) return;
    setIsSubmitted(true);
    const currentQuestion = mcq.mcqs[currentQuestionIndex];
    const selectedForThisQuestion = selectedOptions[currentQuestion.id] || [];
    const isCorrect = selectedForThisQuestion.sort().toString() === currentQuestion.answers.sort().toString();

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswers((prev) => [
      ...prev,
      {
        questionIndex: currentQuestionIndex,
        selectedAnswer: selectedForThisQuestion[0] || 0,
        isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    if (!mcq) return;
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

  const handleStartQuiz = () => {
    setIsQuizStarted(true);
  };

  const handleShowScore = async () => {
    if (!mcq) return;
    setShowScore(true);

    const mcqAttempt = {
      mcqAttempts: {
        mcqSetId: mcq._id || uuid(),
        userId,
        answers,
        score,
        category: mcq.category,
        timestamp: new Date()
      }
    };
    
    try {
        const response = await axios.post("http://localhost:3000/api/attempt/mcq", mcqAttempt);
        console.log("MCQ attempt saved successfully:", response.data);
      } catch (error) {
        console.error("Failed to save MCQ attempt:", error);
      }
  };

  const handleStartOver = () => {
    setSelectedOptions({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setIsQuizStarted(false);
    setScore(0);
    setShowScore(false);
  };

  const isCorrectAnswer = (index: number) => {
    if (!mcq) return false;
    return mcq.mcqs[currentQuestionIndex].answers.includes(index);
  };

  const isOptionSelected = (questionId: number) => {
    return (selectedOptions[questionId] || []).length > 0;
  };

  // Early return for loading state
  if (!mcq) {
    return (
      <div className="p-8 bg-white dark:bg-[#1F1F1F] rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Quiz...</h2>
          <p>Please wait while we prepare your questions.</p>
        </div>
      </div>
    );
  }

  // Check for empty quiz
  if (!Array.isArray(mcq.mcqs) || mcq.mcqs.length === 0) {
    return (
      <div className="p-8 bg-white dark:bg-[#1F1F1F] rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
          <p>This quiz doesn't have any questions yet.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = mcq.mcqs[currentQuestionIndex];

  return (
    <div className="p-8 bg-white dark:bg-[#1F1F1F] rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      {!isQuizStarted ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start the Quiz?</h2>
          <p className="mb-8">You will answer {mcq.mcqs.length} questions.</p>
          <button
            onClick={handleStartQuiz}
            className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 text-lg"
          >
            Start Quiz
          </button>
        </div>
      ) : (
        <div>
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
                      disabled={isSubmitted && mode === "exam"}
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
                {mode === "exam" ? "Submit" : "Check Answer"}
              </button>
              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0 || !isSubmitted}
                  className={`bg-gray-500 text-white py-2 px-4 rounded-lg ${
                    currentQuestionIndex === 0 || !isSubmitted
                      ? "bg-gray-300 cursor-not-allowed"
                      : "hover:bg-gray-600"
                  }`}
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
                  <button
                    onClick={handleNext}
                    disabled={!isSubmitted}
                    className={`bg-gray-500 text-white py-2 px-4 rounded-lg ${
                      isSubmitted ? "bg-green-500 hover:bg-green-600" : "cursor-not-allowed"
                    }`}
                  >
                    Next
                  </button>
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
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MCQSection;