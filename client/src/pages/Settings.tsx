import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

export default function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="dark:bg-[#111111] bg-white min-h-screen">
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex w-screen h-screen text-gray-700 min-h-screen">
        <Sidebar isSidebarOpen={isSidebarOpen} />

        <div className="flex flex-col flex-grow min-h-screen">
          
        </div>
      </div>
    </div>
  )
}