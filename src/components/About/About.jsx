import { Link } from "react-router-dom";  // <--- add this line
import styles from "./About.module.scss";

export default function About() {
  return (
    <section className={styles.aboutBanner}>
      <img 
        src="./amz.jpg" 
        alt="Yafato Jewelry Banner" 
        className={styles.bgImage} 
      />
      <div className={styles.overlay}>
        <h2>More Than Jewelry  A Movement</h2>
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
