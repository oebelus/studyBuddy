import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState } from "react";
import { getTheme } from "../../utils/theme";
import { initialState, reducer } from "../../reducer/store";

interface NavbarProps {
    isSidebarOpen: boolean,
    toggleSidebar: () => void
}

export default function Navbar({isSidebarOpen, toggleSidebar}: NavbarProps) {
    const [theme, setTheme] = useState<string>(getTheme())
    
    const checked = getTheme() === "light";

    const [, dispatch] = useReducer(reducer, initialState)
    
    const handleThemeSwitch = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    useEffect(() => {
        dispatch({ type: 'CHANGE_THEME',  payload: theme })
    }, [theme])

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }, [theme])

    return (
        <div className="min-w-screen flex justify-between items-center dark:bg-[#1F1F1F] bg-white p-4 shadow-lg">
            <div className="flex items-center">
            <button
                className="p-1 mr-4 rounded-md text-white bg-[#2F2F2F]"
                onClick={toggleSidebar}
            >
                <span className={`material-symbols-outlined`}>
                    {isSidebarOpen ? "close" : "menu_open"}
                </span>
                
            </button>
            <h1 className="text-2xl font-semibold dark:text-white text-zinc-800 font-serif">StudyBuddy,</h1>
            <span className="text-zinc-600 dark:text-gray-200 mt-1 ml-4 hidden md:block">Generates MCQs and Flashcards, Previews PDFs</span>
            </div>
            <label htmlFor="Toggle1" className="inline-flex items-center space-x-4 cursor-pointer dark:text-gray-800">
            <span>{(theme === "dark" && <FontAwesomeIcon icon={faMoon} inverse />) || (theme === "light" && <FontAwesomeIcon icon={faMoon}/>)}</span>
            <span className="relative">
                <input id="Toggle1" type="checkbox" className="hidden peer" onChange={handleThemeSwitch} checked = {checked} />
                <div className="w-10 h-6 rounded-full shadow-inner dark:bg-gray-600 bg-gray-400 peer-checked:dark:bg-white transition"></div>
                <div className="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto bg-gray-300"></div>
            </span>
            <span className="color-white">{(theme === "dark" && <FontAwesomeIcon icon={faSun} inverse />) || (theme === "light" && <FontAwesomeIcon icon={faSun}/>)}</span>
            </label>
        </div>
    )
}
