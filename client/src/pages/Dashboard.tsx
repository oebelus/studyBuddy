import Navbar from "../components/dashboard/Navbar";
import QuizPage from "./QuizPage";

export default function Dashboard() {

  return (
    <div className="dark:bg-[#111111] bg-white min-h-screen">
      <Navbar />
      <div className="flex w-screen h-screen text-gray-700 min-h-screen">
        <div className="flex flex-col flex-grow min-h-screen">
          <QuizPage/>
        </div>
      </div>
    </div>
  )
}
