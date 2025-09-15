import styles from './AboutPage.module.scss';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe2, Mountain } from "lucide-react";

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <img
          src="./heroimg2.jpg"
          alt="Yafato Jewelry"
          className={styles.bgImage}
        />
        <div className={styles.heroOverlay}></div>

        <div className={styles.heroContent}>
          {/* Top Quote */}
          <motion.blockquote
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className={styles.topQuote}
          >
            “Don’t leave home without it.” <span>– My Mom</span>
          </motion.blockquote>

          {/* Middle Heading */}
          <div className={styles.centerContent}>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Jewelry That Carries Your Meaning
            </motion.h1>
            <p>
              Yafato creates more than jewelry — we create reminders.  
              Each piece is designed to hold meaning, crafted to meet your eyes  
              and return you to yourself.
            </p>
          </div>

          {/* Bottom Quote */}
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className={styles.bottomQuote}
          >
            “Crafted in quality silver 925 and real gold in 14k, 18k, and 22k —  
            Yafato is a Scandinavian brand rooted in West African heritage.  
            Minimal. Timeless. Meaningful.”
          </motion.blockquote>
        </div>
      </section>

      {/* Meet the Maker */}
      <motion.section className={styles.makerSection}>
        <div className={styles.split}>
          <div className={styles.imageWrap}>
            <img src="/amzface.jpg" alt="Amz Silver at work" />
          </div>
          <div className={styles.textWrap}>
            <h2>Meet Amz Silver</h2>
            <p>
              Amz is more than a craftsman — he’s an artist carrying generations of skill.  
              From The Gambia and Senegal, his legacy is one of precision, soul,  
              and timeless artistry.
            </p>
            <p>
              Each creation is born from heritage and shaped with dignity.  
              His jewelry is not just worn — it’s carried, like a story passed down.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Cultural Meaning */}
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
    <p>Founded and branded, influenced by norwegian heart </p>
  </div>
  <div className={styles.feature}>
    <h3>One Voice</h3>
    <p>Yafato brings these worlds together in each piece.</p>
  </div>
</div>

      </motion.section>

      {/* Video Section */}
      <motion.section className={styles.videoSection}>
        <h2>Our Story in Motion</h2>
        <div className={styles.videoWrapper}>
          <video className={styles.videoPlayer} controls playsInline>
            <source src="/Yafatoo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section className={styles.ctaSection}>
        <h2>Carry Your Reminder</h2>
        <Link to="/products" className={styles.shopBtn}>
          Explore the Collections
        </Link>
        <p className={styles.instaFollow}>
          Follow the journey on{" "}
          <a href="https://instagram.com/yafato_" target="_blank" rel="noreferrer">
            @yafato
          </a>
        </p>
      </motion.section>

    </div>
  );
}
