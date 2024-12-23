import { useEffect, useState } from "react";
import { MCQs } from "../../../types/mcq";
import Quiz from "../../../pages/Quiz";

type MCQSectionProps = {
  mode: "training" | "exam";
  mcq: MCQs | undefined;
};

const MCQSection = ({ mcq }: MCQSectionProps) => {
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
  const [length, setLength] = useState<number>(0);

  useEffect(() => {
    if (mcq && mcq.mcqs) {
      setLength(mcq.mcqs.length);
    }
  }, [mcq]);

  const handleStartQuiz = () => {
    setIsQuizStarted(true);
    if (mcq !== undefined)
      window.location.href = `/quiz/${mcq._id}`;
  };

  return (
    <div>
      {!isQuizStarted && mcq ? (
        <div className="text-center rounded-lg shadow-lg max-w-2xl mx-auto mt-8 p-8 bg-white dark:bg-[#1F1F1F]">
          <h2 className="text-2xl font-bold mb-4">Ready to Start the Quiz?</h2>
          <p className="mb-8">You will answer {length} questions.</p>
          <button
            onClick={handleStartQuiz}
            className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 text-lg"
          >
            Start Quiz
          </button>
        </div>
      ) : (
        mcq !== undefined && < Quiz />
      )}
    </div>
  );
};

export default MCQSection;