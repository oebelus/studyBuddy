import { useState } from "react";
import InnerNavbar from "../components/dashboard/layout/InnerNavbar";
import LargeSidebar from "../components/dashboard/layout/LargeSidebar";
import SmallSidebar from "../components/dashboard/layout/SmallSidebar";
import Navbar from "../components/dashboard/Navbar";

export default function Dashboard() {
  const [clicked, setClicked] = useState("")

  return (
    <div className="dark:bg-[#111111] bg-white">
      <Navbar />
      <div className="flex w-screen h-screen text-gray-700">
        <SmallSidebar clicked={clicked} setClicked={setClicked} />
        <LargeSidebar />
        <div className="flex flex-col flex-grow">
          <InnerNavbar title={clicked ? clicked[0].toUpperCase() + clicked.slice(1, clicked.length) : "Dashboard"} />
        </div>
      </div>
    </div>
  )
}
