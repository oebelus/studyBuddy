import styles from "../../style";
import { introductions } from "../../utils/constants";

export default function Introduction() {
  return (
    <section className="bg-[#f2f9ff] rounded-lg mt-10 gap-[80px] flex flex-col justify-center items-center p-8">
      <div className="text-center">
        <h1 className={`${styles.heading2} text-[52px] text-[#1f387c]`}>Introduction to StudyBuddy</h1>
        <p className="text-[30px]">Discover what is it like to generate quizzes and flashcards effortlessly!</p>
      </div>
      <div className="grid grid-cols-2 gap-[100px] justify-center">
      {introductions.map((introduction) => (
        <div className="text-center" key={introduction.id}>
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-blue-200 flex items-center justify-center h-[100px] w-[100px] mb-4">
              <span className="text-[#2E4C9E] material-symbols-outlined text-[60px]">{introduction.icon}</span>
            </div>
            <p className="text-[#132968] font-bold sm:text-[20px] md:text-[30px]">{introduction.title}</p>
            <p className="text-slate-500 max-w-[300px]">{introduction.value}</p>
          </div>
        </div>
      ))}
    </div>
    </section>
  )
}
