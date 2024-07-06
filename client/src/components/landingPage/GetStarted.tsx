import { Link } from "react-router-dom"

export default function GetStarted() {
  return (
    <Link to='register'>
      <button className="button text-[20px]">
        <span className="material-symbols-outlined relative top-[7px]">
            keyboard_arrow_right
        </span>
        Get started
        <span className="button-span"> ─ for free</span>
      </button>
    </Link>
  )
}
