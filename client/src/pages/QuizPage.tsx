import { useEffect, useReducer, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import Topics from "../components/topic/Topics";
import { Topic } from "../types/Topic";
import GenerateModal from "../components/GenerateModal";
import { MCQ, MCQs } from "../types/mcq";
import { initialState, reducer } from "../reducer/store";
import MCQSection from "../components/topic/Quiz/MCQSection";
import { axiosInstance } from "../services/auth.service";

export default function QuizPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [quiz, setQuiz] = useState<MCQ[]>();
  const [loading, setLoading] = useState(false);
  const [, setTitle] = useState("");
  const [, setCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [quizId, setQuizId] = useState("")
  const [mcq, setMcq] = useState<MCQs>();
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    console.log(quiz)
  }, [quiz])
  
  useEffect(() => {
    axiosInstance.get(`/quiz/mcq`)
      .then((response) => {
        const mcqs = response.data.mcq
        const userTopics: Topic[] = mcqs.map((mcq: MCQs) => ({
          name: mcq.title,
          category: mcq.category,
          numberOfQuestions: mcq.mcqs?.length - 1,
          id: mcq._id
        }))

        const selectMcq: MCQs = mcqs.find((mcq: MCQs) => mcq._id === quizId)
        setMcq(selectMcq)

        dispatch({type: "GET_MCQS", payload: mcqs})
        dispatch({type: 'GET_MCQS_TOPIC', payload: userTopics})
        
      }).catch((err) => console.log(err))
  }, [quizId])

  useEffect(() => {
    axiosInstance.get(`/quiz/mcq/${quizId}`)
    .then((response) => {
      setMcq(response.data.mcq.mcqs)
    })
    .catch((err) => console.log(err))
  }, [quizId]);

  return (
    <div className="font-mono dark:bg-[#111111] bg-white min-h-screen overflow-x-hidden">

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
          {state.mcqsTopics && <Topics type='quiz' setGenerated={setGenerated} setQuizId={setQuizId} topics={state.mcqsTopics} setSelectedTopic={setSelectedTopic} />}
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setQuiz={setQuiz}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isGenerateOpen={true}
            quiz={quiz}
            setGenerated={setGenerated}
          />

          {/* {generated && quiz && (
              <div className="flex flex-col">
                <SaveQuiz category={category} title={title} mcqs={quiz}/>
                <Mcq mode="training" mcq={mcq} />
              </div>
          )} */}

          <button className={`${loading ? "" : "hidden"}`} type="submit">
            {loading ? <div className="w-16 h-16 mx-auto mt-5 border-4 border-dashed rounded-full animate-spin border-black dark:border-white"></div> : "<>Search</>"}
          </button>

          {
            quiz && quiz.length > 0 &&
            <MCQSection mode="training" mcq={mcq} />
          }
          
          {!generated && 
          <div className="flex flex-col">
            <h3 className="text-3xl mt-8 ml-4 font-mono dark:text-white">{selectedTopic}</h3>
            <MCQSection mode="training" mcq={mcq} />
          </div>
          }

        </div>
      </div>
    </div>
  );
}
