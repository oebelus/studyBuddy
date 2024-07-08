import { sidebar } from "../../../utils/constants";

export default function SmallSidebar() {
  return (
    <div className="flex flex-col items-center w-16 pb-4 overflow-auto border-r dark:bg-[#303030] border-gray-300">
        {
            sidebar.map((element) => (
                <a href={`/${element.link}`} key={element.id} className="flex items-center justify-center flex-shrink-0 w-10 h-10 mt-4 rounded hover:bg-gray-300 dark:hover:bg-zinc-700">
                    <span className="material-symbols-outlined dark:text-white">
                        {element.icon}
                    </span>
                </a>
            ))
        }
    </div>
  )
}
