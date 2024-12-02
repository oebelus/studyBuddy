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
                className={`${toggle ? "left-52" : "left-4"} rounded-full bg-white absolute top-4 z-50 h-7 w-8 flex items-center justify-center cursor-pointer shadow`}>
                {toggle ? "X" : "☰"}
            </div>

            <div
                className={`${
                    toggle ? "w-64" : "hidden"
                } h-full bg-[#333333] mr-4 fixed text-white transition-transform duration-300 p-4`}
            >
                <p className="mt-24 mb-4 text-2xl font-bold">{title}</p>
                <div className="grid grid-cols-4 gap-4 bg-zinc-600 p-2 rounded-lg">
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
