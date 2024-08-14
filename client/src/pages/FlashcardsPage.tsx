import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import axios from "axios";
import { Topic } from "../types/Topic";
import { Flashcard, Flashcards } from "../types/flashcard";
import Topics from "../components/topic/Topics";
import FlipCard from "../components/topic/FlipCard";
import GenerateModal from "../components/GenerateModal";

export default function FlashcardsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [topics, setTopics] = useState<Topic[]>([])
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(`http://localhost:3000/api/quiz/flashcard`,
      {
        headers: {
            Authorization: `Bearer ${token}`
        }
      }
    ).then((response) => {
      console.log(response.data)
      const flashcards = response.data.flashcard

      const userTopics: Topic[] = flashcards.map((flashcard: Flashcards) => ({
        name: flashcard.title,
        category: flashcard.category,
        numberOfQuestions: flashcard.flashcards.length - 1,
        id: flashcard._id
      }))

      setTopics(userTopics);
      
    }).catch((err) => console.log(err))
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    console.log(flashcards)
  }, [flashcards])
  
  return (
    <div className="font-mono dark:bg-[#111111] bg-white min-h-screen overflow-hidden">
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex w-screen h-screen text-gray-700">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        
        <div className="flex flex-col flex-grow p-4 dark:text-white">
          <h1 className="text-5xl mt-4 ml-4">Flashcards</h1>
          <p className="text-xl mt-4 ml-4">Your topics:</p>
      
          <Topics topics={topics} setSelectedTopic={setSelectedTopic} />
          
            <div className="flex rounded-lg cursor-pointer gap-4 p-2 w-fit mt-2" onClick={() => setIsOpen(true)}>
              <p className="mt-1">Generate Flashcards:</p> 
            </div>
            <GenerateModal
              type="flashcard"
              setCategory={setCategory}
              setTitle={setTitle}
              setLoading={setLoading}
              setQuiz={setFlashcards}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isGenerateOpen={true}
              quiz={flashcards}
            />
              
          {
            flashcards && flashcards.length > 0 && <FlipCard category={category} title={title} flashcards={flashcards} />
          }
          <button className={`${loading ? "" : "hidden"}`} type="submit">{loading ? <div className="w-16 h-16 mx-auto mt-5 border-4 border-dashed rounded-full animate-spin border-black dark:border-white"></div> : "<>Search</>"}</button>
          
          <div>
            <h3 className="text-3xl mt-8 ml-4 font-mono dark:text-white">{selectedTopic}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
