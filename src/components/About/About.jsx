import { Link } from "react-router-dom";
import styles from "./About.module.scss";

export default function About() {
  return (
    <section className={styles.aboutBanner} aria-label="Yafato story banner">
      <img
        src="https://cdn.shopify.com/s/files/1/0952/4261/7177/files/me.jpg?v=1758293545"
        alt="Yafato artisan sketching jewelry designs"
        className={styles.bgImage}
        loading="eager"
        decoding="async"
        fetchpriority="high"
      />

      <div className={styles.overlay}>
        <h2 className={styles.visuallyHidden}>Our Story</h2>

        <Link to="/about" className={styles.aboutBtn} aria-label="Read our story">
          Our Story
        </Link>
      </div>
    </section>
  );
}
