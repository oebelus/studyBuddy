import React, { useState } from "react";

export type MCQ = {
  id: number;
  answers: number[];
  question: string;
  options: string[];
};

type MCQSectionProps = {
  mode: "training" | "exam";
  mcq: MCQ[] | undefined;
};

const MCQSection: React.FC<MCQSectionProps> = ({ mode, mcq }) => {
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number[] }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showScore, setShowScore] = useState<boolean>(false);

  const handleOptionChange = (index: number) => {
    const currentQuestionId = mcq ? mcq[currentQuestionIndex].id : -1;
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
    setIsSubmitted(true);
    const currentQuestion = mcq ? mcq[currentQuestionIndex] : null;
    if (currentQuestion) {
      const selectedForThisQuestion = selectedOptions[currentQuestion.id] || [];
      if (
        selectedForThisQuestion.sort().toString() === currentQuestion.answers.sort().toString()
      ) {
        setScore((prev) => prev + 1);
      }
    }
  };

  const handleNext = () => {
    if (mcq && currentQuestionIndex < mcq.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsSubmitted(false);
    }
  };

  const handlePrevious = () => {
    if (mcq && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setIsSubmitted(false);
    }
  };

  const handleStartQuiz = () => {
    setIsQuizStarted(true);
  };

  const handleShowScore = () => {
    setShowScore(true);
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
    return mcq ? mcq[currentQuestionIndex].answers.includes(index) : false;
  };

  const isOptionSelected = (questionId: number) => {
    return (selectedOptions[questionId] || []).length > 0;
  };

  if (!mcq || mcq.length === 0) return null;

  const currentQuestion = mcq[currentQuestionIndex];

  return (
    <div className="p-8 bg-white dark:bg-[#1F1F1F] rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      {!isQuizStarted ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start the Quiz?</h2>
          <p className="mb-8">You will answer {mcq.length} questions.</p>
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
                Question {currentQuestionIndex + 1} of {mcq.length}
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
                className={`mt-4 bg-blue-500 text-white dark:bg-[#111111] dark:hover:bg-[#0f0f0f] py-3 px-6 rounded-lg  w-full text-lg ${
                  isSubmitted ? "bg-gray-200 text cursor-not-allowed" : "hover:bg-blue-600"
                }`}
              >
                {mode === "exam" ? "Submit" : "Check Answer"}
              </button>
              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0 || !isSubmitted}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                >
                  Previous
                </button>
                {currentQuestionIndex + 1 === mcq.length && isSubmitted ? (
                  <button
                    onClick={handleShowScore}
                    disabled={!isSubmitted}
                    className={`cursor-pointer bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 ${
                      isSubmitted ? "bg-green-500" : "dark:text-black bg-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Check Your Score
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!isSubmitted}
                    className={`bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 ${
                      isSubmitted ? "bg-green-500" : "bg-gray-600 cursor-not-allowed"
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
                Your score: {score}/{mcq.length}
              </div>
              <div className="flex gap-4 justify-center mt-4">
                <button
                  onClick={handleStartOver}
                  className="bg-green-400 px-4 py-2 rounded-lg"
                >
                  Start Over
                </button>
                <button className="bg-yellow-400 px-4 py-2 rounded-lg">
                  Save Quiz
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
