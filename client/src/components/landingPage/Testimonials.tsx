import styles from "../../style";
import { feedback } from "../../utils/constants";
import FeedbackCard from "./FeedbackCard";

export default function Testimonials() {
  return (
    <section id="testimonials" className={`${styles.paddingY} ${styles.flexCenter} flex-col relative`}>

      <div className="w-full flex justify-between items-center md:flex-row flex-col sm:mb-16 mb-6 relative z-[1]">
        <h1 className={`${styles.heading2}`}>What people are <br className="sm:block hidden" /> saying about us:</h1>
        <div className="w-full md:mt-0 mt-6">
          <p className={`${styles.paragraph} text-left max-w-[450px]`}>"Everything you need to excel in your studies, all in one place. From interactive flashcards to comprehensive MCQs, we provide the tools for academic success."</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center w-full relative z-[1]">
        {
          feedback.map((card) => (
            <FeedbackCard key={card.id} {...card} />
          )
        )}
      </div>
    </section>
  )
}
