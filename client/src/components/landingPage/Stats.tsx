import styles from "../../style";
import { stats } from "../../utils/constants";

export default function Stats() {
  return (
    <section className={`${styles.flexCenter} flex-row flex-wrap`}>
      {
        stats.map((stat) => (
          <div key={stat.id} className={`flex-1 flex flex-row justify-start items-center m-3`}>
            <h4 className="font-semibold xs:text-[40px] text-[30px] xs:leading-[53px] leading-[43px]">{stat.value}</h4>
            <p className="xs:text-[20px] text-[15px] xs:leading-[26px] leading-[21px] bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-clip-text text-transparent uppercase ml-3">{stat.title}</p>
          </div>
        ))
      }
    </section>
  )
}
