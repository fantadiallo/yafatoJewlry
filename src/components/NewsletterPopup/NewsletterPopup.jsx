import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import NewsletterForm from "../NewsletterForm/NewsletterForm";
import styles from "./NewsletterPopup.module.scss";

export default function NewsletterPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("newsletterSeen");
    if (!hasSeenPopup) {
      setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem("newsletterSeen", "true");
      }, 1500);
    }
  }, []);

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          className={styles.popupOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.popupContent}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <button
              className={styles.closePopup}
              onClick={() => setShowPopup(false)}
            >
              ✕
            </button>

            <img
              src="/yafato.png"
              alt="Yafato Logo"
              className={styles.logoImage}
            />

            <h1 className={styles.logo}>YAFATO</h1>
            <h2 className={styles.heading}>A light that never leaves</h2>
            <p className={styles.subheading}>
              A new era of silver is coming. Launching August 25.
            </p>
            <p className={styles.notice}>
              Be first. First 5 get 50% off — 10% for all new signups.
            </p>

            <NewsletterForm />

            <div className={styles.socials}>
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
