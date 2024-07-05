import { useState } from "react"
import { navLinks } from "../../utils/constants"

export default function Navbar() {
  const [toggle, setToggle] = useState(false);

  return (
    <nav className="flex justify-between items-center py-6 navbar w-full">
      <h1 className="text-4xl font-semibold text-zinc-800 font-serif mr-5">StudyBuddy</h1>
      <div className="sm:flex hidden">
        <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {
          navLinks.map((nav, index) => (
            <li
              key={index}
            >
              <a href="/navbar" className={`font-poppins font-normal cursor-pointer text-[16px] mr-10 dark:text-white`}>
                {nav.name}
              </a>
            </li>
          ))
        }
        </ul>
        <button className="border-slate-300 border-2 w-20 p-2 rounded-md">Login</button>
      </div>

      <div className="sm:hidden flex flex-1 justify-end items-center">
          <div className="flex gap-4 mr-4">
            <button className="border-slate-300 border-2 p-2 rounded-md">Login</button>
          </div>
          <div className="cursor-pointer" onClick={() => setToggle(prev => !prev )}>
            {
              toggle ? 
              <span className="material-symbols-outlined">
                close
              </span>
              :
              <span className="material-symbols-outlined">
                menu
              </span>
            }
          </div>
          <div
            className={`${toggle ? 'flex' : 'hidden'} p-6 bg-black-grandient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sider`}
          >
            <ul className="list-none flex flex-col justify-end items-center flex-1">
            {
              navLinks.map((nav, index) => (
                <li
                  key={nav.id}
                >
                  <a href="/navbar" className={`font-poppins font-normal cursor-pointer text-[16px] ${index === navLinks.length - 1 ? 'mb-0' : 'mb-4'} dark:text-white`}>
                    {nav.name}
                  </a>
                </li>
              ))
            }
          </ul>
          </div>
        </div>
    </nav>
  )
}
