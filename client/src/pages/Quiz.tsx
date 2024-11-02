import { useEffect, useState } from "react";
import axios from "axios";
import { MCQs } from "../types/mcq";
import Questions from "../components/topic/Quiz/Elements/Questions";
import UtilityBox from "../components/topic/Quiz/Elements/UtilityBox";

export default function Quiz() {
    const [mcq, setMcq] = useState<MCQs | null>(null);
    const [userId, setUserId] = useState<string>("");
    const [topic, setTopic] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

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
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-8">Quiz: {topic}</h2>
            <Questions mcq={mcq} userId={userId} topic={topic} />
            <UtilityBox />
        </div>
    );
}