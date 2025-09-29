import styles from "./AboutPage.module.scss";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe2, Mountain } from "lucide-react";
import { useRef, useEffect } from "react";

/**
 * AboutPage Component
 *
 * Renders the main About page for Yafato Jewelry.  
 * It combines brand storytelling, heritage highlights, and visual content
 * (images, video, and motion animations).
 *
 * Features:
 * - **Hero section** with inspirational quotes and brand message.
 * - **Maker section** introducing the craftsman (Amz Silver).
 * - **Meaning section** highlighting the dual heritage (West Africa + Scandinavia).
 * - **Video section** with autoplay-prevented video showcasing the story in motion.
 * - **CTA section** encouraging newsletter signup and Instagram follow.
 *
 * Video Handling:
 * - Uses a `ref` to prevent autoplay beyond the first frame.
 * - Ensures video is muted, inline, and does not loop automatically.
 *
 * Accessibility:
 * - Proper `alt` text for images.
 * - Semantic headings (`h1`, `h2`, `h3`) for content structure.
 * - Motion animations respect accessibility as progressive enhancement.
 *
 * @component
 * @returns {JSX.Element} The rendered About page
 */
export default function AboutPage() {
  const vidRef = useRef(null);

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    const onMeta = () => {
      try {
        v.currentTime = 0.01;
      } catch {}
    };
    const onPlay = () => v.pause();
    v.addEventListener("loadedmetadata", onMeta, { once: true });
    v.addEventListener("play", onPlay, { once: true });
    v.play().catch(() => {});
    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("play", onPlay);
    };
  }, []);

  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <img src="/heroimg2.jpg" alt="Yafato Jewelry" className={styles.bgImage} />
        <div className={styles.heroOverlay}></div>

        <div className={styles.heroContent}>
          <motion.blockquote
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className={styles.topQuote}
          >
            “Don’t leave home without it.” <span>– My Mom</span>
          </motion.blockquote>

          <div className={styles.centerContent}>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Jewelry That Carries Your Meaning
            </motion.h1>
            <p>
              Yafato creates more than jewelry — we create reminders. Each piece is designed to
              hold meaning, crafted to meet your eyes and return you to yourself.
            </p>
          </div>

          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className={styles.bottomQuote}
          >
            “Crafted in quality silver 925 and real gold in 14k, 18k, and 22k — Yafato is a
            Scandinavian brand rooted in West African heritage. Minimal. Timeless. Meaningful.”
          </motion.blockquote>
        </div>
      </section>

      {/* Maker Section */}
      <motion.section className={styles.makerSection}>
        <div className={styles.split}>
          <div className={styles.imageWrap}>
            <img src="/amzface.jpg" alt="Amz Silver at work" />
          </div>
          <div className={styles.textWrap}>
            <h2>Meet Amz Silver</h2>
            <p>
              Amz is more than a craftsman — he’s an artist carrying generations of skill. From The
              Gambia and Senegal, his legacy is one of precision, soul, and timeless artistry.
            </p>
            <p>
              Each creation is born from heritage and shaped with dignity. His jewelry is not just
              worn — it’s carried, like a story passed down.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Meaning Section */}
      <motion.section className={styles.meaningSection}>
        <h2>Rooted in Two Worlds</h2>
        <div className={styles.features}>
          <div className={styles.feature}>
            <Globe2 className={styles.icon} />
            <h3>West Africa</h3>
            <p>Spirit, rhythm, and heritage of creation.</p>
          </div>
          <div className={styles.feature}>
            <Mountain className={styles.icon} />
            <h3>Scandinavia</h3>
            <p>Founded and branded, Norwegian heart.</p>
          </div>
          <div className={styles.feature}>
            <h3>One Voice</h3>
            <p>Yafato brings these worlds together in each piece.</p>
          </div>
        </div>
      </motion.section>

      {/* Video Section */}
      <motion.section
        className={styles.videoSection}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h2>Our Story in Motion</h2>
        <div className={styles.videoWrapper}>
          <video
            ref={vidRef}
            className={styles.videoPlayer}
            src="https://cdn.shopify.com/videos/c/o/v/3a9635282e544649b927150a4134fb00.mp4?v=4"
            poster="https://cdn.shopify.com/videos/c/o/v/3a9635282e544649b927150a4134fb00-poster.jpg"
            controls
            playsInline
            preload="auto"
            muted
            autoPlay
          />
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className={styles.ctaSection}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className={styles.ctaInner}>
          <h2>Carry Your Reminder</h2>
          <Link to="/newsletter" className={styles.shopBtn}>
            Join the newsletter
          </Link>
          <p className={styles.instaFollow}>
            Follow the journey on{" "}
            <a href="https://instagram.com/yafato_" target="_blank" rel="noreferrer">
              @yafato_
            </a>
          </p>
        </div>
      </motion.section>
    </div>
  );
}
