import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import Topics from "../components/topic/Topics";
import { Topic } from "../types/Topic";
import { MCQ } from "../types/output";
import GenerateModal from "../components/GenerateModal";
import axios from "axios";
import Mcq from "../components/topic/Quiz/Mcq";
import Save from "../components/topic/Flashcard/Save";

export default function QuizPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [quiz, setQuiz] = useState<MCQ[]>();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [quizId, setQuizId] = useState("")
  const [clickedTopic, setClickedTopic] = useState();
  const [mcqId, setMcqId] = useState("")
  const [mcq, setMcq] = useState<MCQ[]>();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    console.log(quizId)
    axios.get(`http://localhost:3000/api/quiz/mcq/${quizId}`)
    .then((response) => setClickedTopic(response.data.topic))
    .catch((err) => console.log(err))
  }, [quizId]);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/quiz/mcq/${quizId}`)
    .then((response) => {
      setMcq(response.data.mcq.mcqs)
    })
    .catch((err) => console.log(err))
  }, [quizId]);


  return (
    <div className="font-mono dark:bg-[#111111] bg-white min-h-screen">

      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`flex sm:grid transition-all duration-300 ${isSidebarOpen ? "sm:ml-64 ml-0 grid-cols-6" : "ml-0 grid-cols-6"} w-full h-screen text-gray-700`}
      >
        <Sidebar isSidebarOpen={isSidebarOpen} />
      
        <div
          className={`${
            isSidebarOpen ? "sm:col-span-4 col-span-5" : "col-span-6"
          } flex flex-col mt-16 flex-grow p-4 dark:text-white`}
        >
          <h1 className="text-5xl mt-4 ml-4">Quiz</h1>
          <p className="text-xl mt-4 ml-4">Your topics:</p>
          <Topics setQuizId={setQuizId} topics={topics} setSelectedTopic={setSelectedTopic} />
          <div className="flex rounded-lg cursor-pointer gap-4 p-2 w-fit mt-2" onClick={() => setIsOpen(true)}>
            <div className="flex gap-2">
              <span className="text-2xl bg-pink-100 hover:bg-pink-200 transition px-2 dark:bg-[#3b3939] dark:hover:bg-[#2b2929] rounded-md material-symbols-outlined">
                add
              </span>
              <p className="text-xl">Generate a Quiz:</p>
            </div> 
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
              <div className="flex flex-col">
                <Save category={category} title={title} type="quiz" items={mcq}/>
                <Mcq mode="training" mcq={quiz} />
              </div>
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
