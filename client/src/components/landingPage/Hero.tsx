import styles from "../../style";
import GetStarted from "./GetStarted";

export default function Hero() {
  return (
    <section id="home" className={`flex md:flex-row flex-col ${styles.paddingY} mt-8`}>
      <div className={`flex-1 ${styles.flexCenter} text-left flex-col xl:px-0 sm:px-16 px-6`}>
        <div className="flex flex-col xl:flex-row justify-between items-center w-full">
          <div className="xl:w-2/3">
            <h1 className="font-semibold ss:text-[72px] text-[52px]">Transform Your PDFs <br className="sm:block hidden" /> into {" "}
              <span className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-clip-text text-transparent">Interactive</span> <br className="sm:block hidden" /> {" "}
              <span className="font-normal">Learning Tools</span>
            </h1>
            <p className={`${styles.paragraph} max-w-[470px] mt-5`}>Our intuitive tool simplifies the process of extracting key information from PDF documents, generating multiple-choice questions and concise flashcards tailored to your study needs.</p>
            <div className="mt-10 sm:text-center lg:text-left xs:text-center">
            <GetStarted />
          </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex">
        <img src="hero.png" alt="" />
      </div>
    </section>
  )
}
