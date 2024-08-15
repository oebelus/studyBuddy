import { useReducer } from 'react';
import { Navbar, Hero, Stats, Introduction, Testimonials, Pricing, Footer } from '../components/landingPage/index'
import styles from '../style'
import { initialState, reducer } from '../reducer/store';
import { Navigate } from 'react-router-dom';

export default function Home() {
  const [state, ] = useReducer(reducer, initialState)

  if (state.user) {
      return <Navigate to="/dashboard" />;
  }

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
