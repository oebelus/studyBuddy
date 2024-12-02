import { useEffect, useState } from "react";
import axios from "axios";
import { MCQs } from "../types/mcq";
import Questions from "../components/topic/Quiz/Elements/Questions";
import UtilityBox from "../components/topic/Quiz/Elements/UtilityBox";
import { answerKind } from "../types/Answer";

export default function Quiz() {
    const [mcq, setMcq] = useState<MCQs | null>(null);
    const [userId, setUserId] = useState<string>("");
    const [topic, setTopic] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [correction, setCorrection] = useState<{answered: boolean, correct: answerKind}[]>(
        mcq?.mcqs.map(() => ({answered: false, correct: "incorrect"})) || []
    )
    const [answers, setAnswers] = useState<{[key: number]: boolean}>({});

    useEffect(() => {
        if (!mcq?.mcqs) return;

        // Initialize corrections with unanswered defaults
        const corrections = mcq.mcqs.map(() => ({
            answered: false,
            correct: "not answered" as answerKind,
        }));

        // Update corrections with answered values
        Object.entries(answers).forEach(([index, answer]) => {
            const idx = parseInt(index, 10); // Convert string key to number
            if (idx >= 0 && idx < corrections.length) {
                corrections[idx] = {
                    answered: true,
                    correct: answer ? "correct" as answerKind : "incorrect" as answerKind,
                };
            }
        });

        setCorrection(corrections);
    }, [answers, mcq]);


    const topicId = window.location.pathname.split("/")[2];

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError("");
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    throw new Error("No authentication token found");
                }

                setIsLoading(true);
                // Fetch user data
                const userResponse = await axios.get("http://localhost:3000/api/users", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserId(userResponse.data.user._id);

                // Fetch MCQ data
                const mcqResponse = await axios.get(`http://localhost:3000/api/quiz/mcq/${topicId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setIsLoading(false);
                
                if (!mcqResponse.data.mcq) {
                    throw new Error("No MCQ data found");
                }

                setMcq(mcqResponse.data.mcq);
                setTopic(mcqResponse.data.mcq.category);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setError(error instanceof Error ? error.message : "Failed to load quiz data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [topicId]);

    if (isLoading) {
        return <div className="text-center py-8">Loading quiz...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">Error: {error}</div>;
    }

    if (!mcq || !mcq.mcqs || mcq.mcqs.length === 0) {
        return <div className="text-center py-8">No questions available for this quiz.</div>;
    }

    return (
        <div>
            <UtilityBox questions={correction} title={mcq.title} />
            <div>
                <nav>
                    <div className="bg-[#333333] w-screen rounded-b-lg flex items-center justify-between max-w-3xl mx-auto p-6">
                        <h1 
                            onClick={() => window.location.href = "/"}
                            className="cursor-pointer text-2xl text-white font-bold ">StudyBuddy</h1>
                    </div>
                </nav>
                <div className="max-w-3xl mx-auto p-6">
                    <h2 className="text-2xl font-bold mb-8">Quiz: {topic}</h2>
                    <Questions mcq={mcq} userId={userId} answers={answers} setAnswers={setAnswers} />
                </div>
            </div>
        </div>
    );
}