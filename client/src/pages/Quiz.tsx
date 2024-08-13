import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import { topics } from "../utils/constants";
import Topics from "../components/Topics";
import Generate from "../components/Generate";

export default function Quiz() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [quiz, setQuiz] = useState(false)
  const [loading, setLoading] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleGenerateDropdown = () => {
    setIsGenerateOpen(!isGenerateOpen);
  };

  useEffect(() => {
    console.log(quiz)
  }, [quiz])

  return (
    <div className="font-mono dark:bg-[#111111] bg-white min-h-screen overflow-hidden">
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex w-screen h-screen text-gray-700">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        
        <div className="flex flex-col flex-grow p-4 dark:text-white">
          <h1 className="text-5xl mt-4 ml-4">Quiz</h1>
          <p className="text-xl mt-4 ml-4">Your topics:</p>
      
          <Topics topics={topics} setSelectedTopic={setSelectedTopic} />

          <div className="flex rounded-lg cursor-pointer gap-4 p-2 w-fit mt-2" onClick={toggleGenerateDropdown}>
            <p className="mt-1">{isGenerateOpen ? "▼" : "►"} Generate a Quiz</p> 

          </div>

          {isGenerateOpen && (
            <Generate type="quiz" setLoading={setLoading} setQuiz={setQuiz} />
          )}

          <button className={`${loading ? "" : "hidden"}`} type="submit">{loading ? <div className="w-16 h-16 mx-auto mt-5 border-4 border-dashed rounded-full animate-spin border-white"></div> : "<>Search</>"}</button>
      
          <div>
            <h3 className="text-3xl mt-8 ml-4 font-mono dark:text-white">{selectedTopic}</h3>
          </div>
        </div>
      </div>
    </div>
  )
}
