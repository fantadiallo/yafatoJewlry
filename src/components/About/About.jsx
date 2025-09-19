import { Link } from "react-router-dom";
import styles from "./About.module.scss";

export default function About() {
  return (
    <section className={styles.aboutBanner}>
      <img
        src="https://cdn.shopify.com/s/files/1/0952/4261/7177/files/me.jpg?v=1758293545"
        alt="Yafato Jewelry Banner"
        className={styles.bgImage}
        loading="eager"
        decoding="async"
      />
      <div className={styles.overlay}>
        <h2>Jewelry A Movement</h2>
        <p>
          Rooted in heritage, healing, and expression — Yafato pieces carry
          stories from The Gambia and Senegal to the world.
        </p>
        <Link to="/about" className={styles.aboutBtn}>
          Discover Our Story
        </Link>
      </div>
    </section>
  );
}
