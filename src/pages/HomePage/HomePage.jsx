import About from "../../components/About/About";
import Collection from "../../components/Collection/Collection";
import HeroHome from "../../components/HeroSection/HeroHome";
import styles from "./Home.module.scss";
import { Leaf, Recycle, Truck } from "lucide-react";


export default function HomePage() {

  return (
    <>
    
      <HeroHome />


      <Collection />
      <section className={styles.environmentSection}>
  <div className={styles.environmentContent}>
    <h2>Our Commitment to the Planet</h2>
    <p>
      Every piece is crafted with care using eco-conscious methods and materials.
    </p>

    {/* Luxury eco-icons */}
 <div className={styles.envIcons}>
  <div>
    <Leaf size={28} strokeWidth={1.5} />
    <p>Responsible Materials</p>
  </div>
  <div>
    <Recycle size={28} strokeWidth={1.5} />
    <p>Recyclable Packaging</p>
  </div>
  <div>
    <Truck size={28} strokeWidth={1.5} />
    <p>Carbon-Conscious Delivery</p>
  </div>
</div>


    {/* Extra impact message */}
    <div className={styles.impactBox}>
      <h3>Giving Back</h3>
      <p>
        15% of every purchase supports education and community projects in
        The Gambia — including new waste disposal systems and awareness
        programs to reduce littering.
      </p>
    </div>
  </div>
</section>
<About />

   </>
  );
}