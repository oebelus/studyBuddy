import { useState } from "react";

export default function UtilityBox() {
    const [toggle, setToggle] = useState(false);
    
    return (
        <div className={`bg-yellow-200 absolute h-[20%] left-[50%] -translate-x-[50%] w-[95%] rounded-lg text-center bottom-0 ${toggle ? "hidden" : "block"}`}>
            <div
                onClick={() => setToggle(!toggle)} 
                className="rounded-full bg-white absolute right-2 top-2 h-7 w-8 text-center">X</div>
            <div></div>
        </div>
    )
}
