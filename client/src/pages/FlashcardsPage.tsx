import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import axios from "axios";
import { Topic } from "../types/Topic";
import { Flashcard, Flashcards } from "../types/flashcard";
import Topics from "../components/topic/Topics";
import GenerateModal from "../components/GenerateModal";
import FlipCard from "../components/topic/Flashcard/FlipCard";
import Save from "../components/topic/Flashcard/Save";

export default function FlashcardsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [topics, setTopics] = useState<Topic[]>([])
  const [isOpen, setIsOpen] = useState(false);
  const [flashcardId, setFlashcardId] = useState("")
  const [flashcard, setFlashcard] = useState<Flashcard[]>()

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(`http://localhost:3000/api/quiz/flashcard`,
      {
        headers: {
            Authorization: `Bearer ${token}`
        }
      }
    ).then((response) => {
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

  useEffect(() => {
    axios.get(`http://localhost:3000/api/quiz/flashcard/${flashcardId}`)
    .then((response) => {
      setFlashcard(response.data.flashcard.flashcards)
    })
    .catch((err) => console.log(err))
  }, [flashcardId]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    console.log("flashcard", flashcard)
  }, [flashcard])
  
  return (
    <div className="font-mono dark:bg-[#111111] bg-white min-h-screen overflow-y-hidden">
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`flex sm:grid transition-all dark:bg-[#111111] duration-300 ${isSidebarOpen ? "sm:ml-64 ml-0 grid-cols-6" : "ml-0 grid-cols-6"} w-full min-h-screen text-gray-700`}
      >
        <Sidebar isSidebarOpen={isSidebarOpen} />
        
        <div
          className={`${
            isSidebarOpen ? "dark:bg-[#111111] sm:col-span-4 col-span-5" : "col-span-6"
          } flex flex-col mt-16 flex-grow p-4 dark:text-white h-full overflow-x-hidden`}
        >
          <h1 className="text-5xl mt-4 ml-4">Flashcards</h1>
          <p className="text-xl mt-4 ml-4">Your topics:</p>
      
          <Topics setQuizId={setFlashcardId} topics={topics} setSelectedTopic={setSelectedTopic} />
          
            <div className="flex rounded-lg cursor-pointer gap-4 p-2 w-fit mt-2" onClick={() => setIsOpen(true)}>
              <div className="flex gap-2">
                <span className="text-2xl bg-pink-100 hover:bg-pink-200 transition px-2 dark:bg-[#3b3939] dark:hover:bg-[#2b2929] rounded-md material-symbols-outlined">
                  add
                </span>
                <p className="text-xl">Generate Flashcards:</p>
              </div> 
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
            flashcards && flashcards.length > 0 && 
              <div className="flex flex-col">
                <Save category={category} title={title} type="flashcard" items={flashcards}/>
                <FlipCard flashcards={flashcards} />
              </div>
          }
          <button className={`${loading ? "" : "hidden"}`} type="submit">{loading ? <div className="w-16 h-16 mx-auto mt-5 border-4 border-dashed rounded-full animate-spin border-black dark:border-white"></div> : "<>Search</>"}</button>
          
          <div>
            <h3 className="text-3xl mt-8 ml-4 font-mono dark:text-white">{selectedTopic}</h3>
            <div>
              <FlipCard flashcards={flashcard} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
