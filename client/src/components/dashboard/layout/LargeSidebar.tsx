import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import Create from "../../modals/Create";
import { initialState, reducer } from "../../../reducer/store";
export default function LargeSidebar() {
    const [lessons, setLessons] = useState<string[]>([])
    const [modalIsOpen, setIsOpen] = useState(false);

    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        const token = JSON.stringify(localStorage.getItem('token')!.trim());
        
        axios.get("http://localhost:3000/api/users", { 
            headers: {"Authorization" : `Bearer ${token.trim().slice(1, token.length - 1)}`} 
        })
        .then((response) => {
            dispatch({type: 'SET_TITLES', payload: response.data.user.titles})
            console.log(state.titles);
            
            setLessons(response.data.user.titles)
        })
        .catch((err) => console.log(err.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        console.log(lessons);
    }, [lessons])

    function openModal() {
        setIsOpen(true);
    }

    return (
        <div className="hidden sm:flex dark:text-white dark:bg-[#1F1F1F] flex-col w-56 border-r border-gray-300">
            <button className="relative text-sm focus:outline-none group">
                <div className="flex items-center justify-between w-full h-16 px-4 border-b border-gray-300 dark:hover:bg-zinc-700 hover:bg-gray-300">
                    <span className="font-medium">
                        Dropdown
                    </span> 
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="absolute z-10 flex-col items-start hidden w-full pb-1 dark:bg-[#303030] bg-white shadow-lg group-focus:flex">
                    <a className="w-full px-4 py-2 text-left dark:hover:bg-fuchsia-800 hover:bg-gray-300" href="#">Menu Item 1</a>
                    <a className="w-full px-4 py-2 text-left dark:hover:bg-fuchsia-800 hover:bg-gray-300" href="#">Menu Item 1</a>
                    <a className="w-full px-4 py-2 text-left dark:hover:bg-fuchsia-800 hover:bg-gray-300" href="#">Menu Item 1</a>
                </div>
            </button>
            <Create modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
            <div className="flex flex-col flex-grow p-4 overflow-auto">
                {
                    lessons && lessons.length > 0 && lessons.map((lesson, key) => (
                        <a key={key} className="flex items-center flex-shrink-0 h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 dark:hover:bg-zinc-700" href="#">
                            <span className="leading-none">{lesson}</span>
                        </a>
                    ))
                }
                <button onClick={openModal} className="mt-4 flex items-center flex-shrink-0 h-10 px-3 text-sm font-medium bg-gray-200 rounded dark:bg-[#303030] transition-[200ms] dark:hover:bg-fuchsia-800 hover:bg-gray-300">
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="ml-2 leading-none">New Lesson</span>
                </button>
            </div>
        </div>
    )
}
