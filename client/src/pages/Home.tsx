import { Navbar, Hero, Stats, Introduction, Testimonials, Pricing, Footer } from '../components/landingPage/index'
import styles from '../style'

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className={`${styles.boxWidth}`}>
              <Navbar />
          </div>
      </div>

      <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
            <Hero />
        </div>
      </div>

      <div className={`bg-primary ${styles.flexStart} ${styles.paddingX}`}>
        <div className={`${styles.boxWidth}`}>
            <Stats/>
            <Introduction/>
            <Testimonials/>
            <Pricing/>
            <Footer/>
        </div>
      </div>
    </div>
  )
}
