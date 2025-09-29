import { Link } from "react-router-dom";
import styles from "./About.module.scss";

/**
 * About Component
 *
 * Renders a promotional banner section for the "About" page.  
 * Displays a background image, overlay text, and a call-to-action button
 * linking to the full About page.
 *
 * Features:
 * - Background image with eager loading for fast display.
 * - Overlay with heading and description text.
 * - Button styled `Link` that routes users to the About page.
 *
 * Accessibility:
 * - `alt` text provided for the background image.
 * - Clear heading hierarchy for screen readers.
 *
 * @component
 * @returns {JSX.Element} An About banner section with image, text, and CTA link.
 */
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
