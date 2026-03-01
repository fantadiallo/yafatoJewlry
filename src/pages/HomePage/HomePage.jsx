import About from "../../components/About/About";
import Collection from "../../components/Collection/Collection";
import CraftStrip from "../../components/CraftStrip/CraftStrip";
import HeroHome from "../../components/HeroSection/HeroHome";
import Signatur from "../../components/signatur/signatur";
import styles from "./Home.module.scss";

import { Leaf, Recycle, Truck } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* 1. Emotional hook */}
      <HeroHome />
      <Signatur />

      {/* 2. What defines YAFATO */}
      

      {/* 3. Explore the range */}
      <Collection />
      <CraftStrip />

      {/* 4. Brand story */}
      <About />

      {/* 5. Values & trust */}
      <section className={styles.environmentSection}>
        <div className={styles.environmentContent}>
          <h2>Our Commitment to the Planet</h2>
          <p>
            Every piece is crafted with care using eco-conscious methods and
            materials.
          </p>

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
        </div>
      </section>
    </>
  );
}
