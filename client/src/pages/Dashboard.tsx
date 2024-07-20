import { useEffect, useState } from "react";
import InnerNavbar from "../components/dashboard/layout/InnerNavbar";
import SmallSidebar from "../components/dashboard/layout/SmallSidebar";
import Navbar from "../components/dashboard/Navbar";
import LessonsPage from "./LessonsPage";
import QuizPage from "./QuizPage";

export default function Dashboard() {
  const [clicked, setClicked] = useState("")

  useEffect(() => {
    console.log(clicked);
  }, [clicked])
  
  const components: Record<string, JSX.Element> = {
    lessons: <LessonsPage />,
    generate: <QuizPage />,
  };

  return (
    <div className="dark:bg-[#111111] bg-white">
      <Navbar />
      <div className="flex w-screen h-screen text-gray-700">
        <SmallSidebar clicked={clicked} setClicked={setClicked} />
        <div className="flex flex-col flex-grow">
          <InnerNavbar title={clicked ? clicked[0].toUpperCase() + clicked.slice(1, clicked.length) : "Dashboard"} />
          {components[clicked] || ''}
        </div>
      </div>
    </div>
  )
}
