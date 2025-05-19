import { useState } from "react";
import { answerKind } from "../../../../types/Answer";

interface UtilityBoxProps {
    questions: {
        answered: boolean;
        correct: answerKind;
    }[],
    title: string
}

export default function UtilityBox({questions, title}: UtilityBoxProps) {
    const [toggle, setToggle] = useState(false);
    
    return (
        <div>
            <div
                onClick={() => setToggle(!toggle)}
                className={`z-50 rounded-sm p-4 dark:text-white text-[#1f1f1f] text-4xl h-7 w-8 flex items-center justify-center cursor-pointer`}>
                    {toggle ? "X" : "☰"}
            </div>

            <div
                className={`left-0 top-24 ${
                    toggle ? "w-64" : "w-0 overflow-hidden hidden"
                } h-full border-r-4 bg-white dark:bg-[#1f1f1f] fixed text-white transition-transform duration-300 p-4`}
            >
                <p className="mb-4 text-2xl dark:text-gray-200 text-[#1f1f1f] text-center underline">{title.toUpperCase()}</p>
                <div className="grid grid-cols-4 gap-4 dark:bg-zinc-600 bg-blue-200 border-2 border-violet-300 dark:border-gray-500 p-2 rounded-lg">
                    {questions.map((question, index) => {
                        const bgColor = question.answered
                            ? question.correct === "correct"
                                ? "bg-green-500"
                                : "bg-red-500"
                            : "bg-gray-500";

                        return (
                            <div
                                key={index}
                                className={`${bgColor} flex items-center justify-center h-10 w-10 rounded`}
                            >
                                <p className="text-lg">{index + 1}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}
