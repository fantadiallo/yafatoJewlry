import React from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import NewsletterForm from "../../components/NewsletterForm/NewsletterForm";
import styles from "./CommingSoon.module.scss";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export default function ComingSoon() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.overlay}></div>

      <div className={styles.splitHero}>
        {/* Left Side with Logo */}
        <motion.div
          className={styles.leftSide}
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img
            src="/yafato.png"
            alt="Yafato Logo"
            className={styles.logoImage}
          />
        </motion.div>

        {/* Right Side with Content */}
        <motion.div
          className={styles.rightSide}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className={styles.content}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } },
            }}
          >
            <motion.h1 className={styles.logo} variants={fadeUp}>
              YAFATO
            </motion.h1>

            <motion.h2 className={styles.heading} variants={fadeUp}>
              A light that never leaves
            </motion.h2>

            <motion.p className={styles.subheading} variants={fadeUp}>
              A new era of silver is coming. Launching August 25.
            </motion.p>

            <motion.p className={styles.notice} variants={fadeUp}>
              Be first. First 5 get 50% off, —  10% of for new sign up.
            </motion.p>

            <motion.div className={styles.formWrapper} variants={fadeUp}>
              <NewsletterForm />
            </motion.div>

            <motion.div className={styles.socials} variants={fadeUp}>
              <a
                href="https://instagram.com/Yafato_"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram /> Instagram
              </a>
              <a
                href="https://tiktok.com/@Yafato_"
                target="_blank"
                rel="noreferrer"
              >
                <FaTiktok /> TikTok
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
