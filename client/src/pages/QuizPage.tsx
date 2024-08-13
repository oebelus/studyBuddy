import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import Topics from "../components/topic/Topics";
import { Topic } from "../types/Topic";
import Mcq from "../components/topic/Mcq";
import { MCQ } from "../types/output";
import GenerateModal from "../components/GenerateModal";

export default function QuizPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [quiz, setQuiz] = useState<MCQ[]>();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    console.log(quiz);
  }, [quiz]);

  return (
    <div className="font-mono dark:bg-[#111111] bg-white min-h-screen overflow-hidden">
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex w-screen h-screen text-gray-700">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className="flex flex-col flex-grow p-4 dark:text-white">
          <h1 className="text-5xl mt-4 ml-4">Quiz</h1>
          <p className="text-xl mt-4 ml-4">Your topics:</p>
          <Topics topics={topics} setSelectedTopic={setSelectedTopic} />
          <div className="flex rounded-lg cursor-pointer gap-4 p-2 w-fit mt-2" onClick={() => setIsOpen(true)}>
            <p className="mt-1">{isOpen ? "▼" : "►"} Generate a Quiz</p>
          </div>
          <GenerateModal
            type="quiz"
            setCategory={setCategory}
            setTitle={setTitle}
            setLoading={setLoading}
            setQuiz={setQuiz}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isGenerateOpen={true}
            quiz={quiz}
          />
          {quiz && (
              <Mcq mode="training" mcq={quiz} />
          )}
          <button className={`${loading ? "" : "hidden"}`} type="submit">
            {loading ? <div className="w-16 h-16 mx-auto mt-5 border-4 border-dashed rounded-full animate-spin border-black dark:border-white"></div> : "<>Search</>"}
          </button>
          <div>
            <h3 className="text-3xl mt-8 ml-4 font-mono dark:text-white">{selectedTopic}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
