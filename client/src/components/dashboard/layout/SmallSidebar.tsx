import { sidebar } from "../../../utils/constants";

interface SmallSidebarProps {
    clicked: string,
    setClicked: (el: string) => void
}

export default function SmallSidebar({clicked, setClicked}: SmallSidebarProps) {
    const handleClick = (e: React.MouseEvent<HTMLElement>, el: string) => {
        e.preventDefault();
        setClicked(el)
    }
    return (
        <div className="flex flex-col items-center w-16 pb-4 overflow-auto border-r dark:bg-[#303030] border-gray-300">
            {
                sidebar.map((element) => (
                    <a onClick={(e) => handleClick(e, element.link)} title={element.link[0].toUpperCase() + element.link.slice(1, element.link.length)} href={`/${element.link}`} key={element.id} className={`${clicked === element.link ? "dark:bg-zinc-700 bg-gray-300" : ""} flex items-center justify-center flex-shrink-0 w-10 h-10 mt-4 rounded hover:bg-gray-300 dark:hover:bg-zinc-700`}>
                        <span className="material-symbols-outlined dark:text-white">
                            {element.icon}
                        </span>
                    </a>
                ))
            }
        </div>
    )
}
