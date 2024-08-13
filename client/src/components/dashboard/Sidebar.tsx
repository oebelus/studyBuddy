import { NavLink } from "react-router-dom"
import { sidebar } from "../../utils/constants"

interface SidebarProps {
    isSidebarOpen: boolean
}

export default function Sidebar({isSidebarOpen}: SidebarProps) {

  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-0"
      } z-[99] dark:bg-[#1F1F1F] bg-white text-white min-h-screen absolute transition-all duration-300 ease-in-out`}
    >
      {isSidebarOpen && (
        <div className="p-4">
          {sidebar.map(element => (
            <NavLink to={'/' + element.link} key={element.id} className="text-black dark:text-white p-4 flex gap-4 rounded-lg hover:bg-yellow-100 dark:hover:bg-[#2F2F2F]">
              <span className="material-symbols-outlined">
                {element.icon}
              </span>
              <p className="">
                {element.name}
              </p>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}
