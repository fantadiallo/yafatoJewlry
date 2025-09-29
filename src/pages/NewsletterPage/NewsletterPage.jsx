import React from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./NewsletterPage.module.scss";
import NewsletterForm from "../../components/NewsletterForm/NewsletterForm";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const linkItem = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

/**
 * NewsletterPage
 *
 * Animated landing page for newsletter signups and early access.
 *
 * Features:
 * - Split hero layout with logo (left) and animated content (right).
 * - Launch date announcement and promotional copy.
 * - Newsletter subscription form integrated via `NewsletterForm`.
 * - Early discount offer messaging.
 * - Social media links (Instagram, TikTok).
 * - Back-to-home navigation.
 *
 * Animations:
 * - Framer Motion handles entrance, staggered reveals, and hover effects.
 * - Container & item variants stagger content for smooth flow.
 *
 * Accessibility:
 * - Proper alt text for images.
 * - Semantic headings and links.
 * - Keyboard-navigable back-to-home link.
 *
 * @component
 * @returns {JSX.Element} The rendered newsletter signup / launch announcement page.
 */
export default function NewsletterPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.overlay} />
      <div className={styles.splitHero}>
        {/* Left side: brand logo */}
        <motion.div
          className={styles.leftSide}
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img src="/yafato.png" alt="Yafato Logo" className={styles.logoImage} />
        </motion.div>

        {/* Right side: content */}
        <motion.div
          className={styles.rightSide}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className={styles.content}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
          >
            <motion.h1 className={styles.heroTitle} variants={item}>
              Your Early Invitation
            </motion.h1>

            <motion.h2 className={styles.heading} variants={item}>
              <p>Welcome to early access Official Launch</p>
              <p className={styles.launchDate}>SEPTEMBER 20. Kl:18:00</p>
            </motion.h2>

            {/* Newsletter signup form */}
            <motion.div variants={item}>
              <NewsletterForm source="coming-soon" />
            </motion.div>

            <motion.p className={styles.subheading} variants={item}>
              First 5 get 50% off
            </motion.p>

            {/* Social links */}
            <motion.div className={styles.socials} variants={item}>
              <motion.a
                href="https://instagram.com/Yafato_"
                target="_blank"
                rel="noreferrer"
                variants={linkItem}
                whileHover={{ y: -2, filter: "brightness(1.2)" }}
                transition={{ type: "tween", duration: 0.2 }}
              >
                <FaInstagram /> Instagram
              </motion.a>
              <motion.a
                href="https://tiktok.com/@Yafato_"
                target="_blank"
                rel="noreferrer"
                variants={linkItem}
                whileHover={{ y: -2, filter: "brightness(1.2)" }}
                transition={{ type: "tween", duration: 0.2 }}
              >
                <FaTiktok /> TikTok
              </motion.a>
            </motion.div>

            {/* Back to homepage */}
            <motion.div variants={item} className={styles.backHome}>
              <Link to="/" className={styles.backHomeLink}>
                ← Go back to homepage
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
