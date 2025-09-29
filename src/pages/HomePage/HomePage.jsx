import About from "../../components/About/About";
import Collection from "../../components/Collection/Collection";
import HeroHome from "../../components/HeroSection/HeroHome";
import styles from "./Home.module.scss";
import { Leaf, Recycle, Truck } from "lucide-react";

/**
 * HomePage Component
 *
 * The main landing page for Yafato’s storefront.
 * It introduces visitors to the brand with:
 * - A hero section (`HeroHome`) showcasing the main message.
 * - A product collection preview (`Collection`).
 * - An environment/eco-conscious section with icons and a sustainability message.
 * - An about section (`About`) to introduce brand heritage and story.
 *
 * Features:
 * - Responsive layout styled with `Home.module.scss`.
 * - Uses Lucide icons for eco messages (Leaf, Recycle, Truck).
 * - Encourages brand values: sustainability, responsibility, and storytelling.
 *
 * @component
 * @returns {JSX.Element} The homepage layout
 */
export default function HomePage() {
  return (
    <>
      <HeroHome />

      <Collection />

      <section className={styles.environmentSection}>
        <div className={styles.environmentContent}>
          <h2>Our Commitment to the Planet</h2>
          <p>
            Every piece is crafted with care using eco-conscious methods and
            materials.
          </p>

          {/* Eco-conscious icon highlights */}
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

          {/* Extra sustainability message */}
          <div className={styles.impactBox}>
            <h3>Protecting Nature</h3>
            <p>
              We focus on reducing unnecessary waste and making mindful choices
              to protect the environment — because preserving nature matters
              more than ever.
            </p>
          </div>
        </div>
      </section>

      <About />
    </>
  );
}
