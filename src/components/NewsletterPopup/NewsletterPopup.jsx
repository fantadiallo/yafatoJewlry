import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import NewsletterForm from "../NewsletterForm/NewsletterForm";
import styles from "./NewsletterPopup.module.scss";

const LS_KEY = "newsletterPopupPrefs";
const SS_KEY = "newsletterSeenThisSession";

function getPrefs() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
}
function setPrefs(next) {
  localStorage.setItem(LS_KEY, JSON.stringify(next));
}

function daysBetween(a, b) {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export default function NewsletterPopup({
  delayMs = 1500,
  cooldownDays = 7,
  maxDismissals = 3,
  trigger = "delay",
}) {
  const [showPopup, setShowPopup] = useState(false);

  const canShow = useCallback(() => {
    const prefs = getPrefs();
    if (prefs.subscribed) return false;

    const seenThisSession = sessionStorage.getItem(SS_KEY) === "true";
    if (seenThisSession) return false;

    if ((prefs.dismissCount || 0) >= maxDismissals) return false;

    if (prefs.lastShown) {
      const last = new Date(prefs.lastShown);
      if (daysBetween(last, new Date()) < cooldownDays) return false;
    }

    return true;
  }, [cooldownDays, maxDismissals]);

  useEffect(() => {
    if (!canShow()) return;

    let timer;
    let onScroll;

    if (trigger === "delay") {
      timer = setTimeout(() => setShowPopup(true), delayMs);
    } else if (trigger === "scroll50") {
      onScroll = () => {
        const scrolled =
          (window.scrollY + window.innerHeight) / document.body.scrollHeight;
        if (scrolled >= 0.5) {
          setShowPopup(true);
          window.removeEventListener("scroll", onScroll);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (onScroll) window.removeEventListener("scroll", onScroll);
    };
  }, [canShow, delayMs, trigger]);

  useEffect(() => {
    if (!showPopup) return;
    sessionStorage.setItem(SS_KEY, "true");
    const prefs = getPrefs();
    setPrefs({ ...prefs, lastShown: new Date().toISOString() });
  }, [showPopup]);

  const close = () => {
    setShowPopup(false);
    const prefs = getPrefs();
    setPrefs({
      ...prefs,
      dismissCount: (prefs.dismissCount || 0) + 1,
    });
  };

  const onSubscribed = () => {
    const prefs = getPrefs();
    setPrefs({ ...prefs, subscribed: true });
    setShowPopup(false);
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          className={styles.popupOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Newsletter signup popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            className={styles.popupContent}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            tabIndex={-1}
          >
            <button className={styles.closePopup} onClick={close} aria-label="Close">
              ✕
            </button>

            <img src="/yafato.png" alt="Yafato Logo" className={styles.logoImage} />
            <h1 className={styles.logo}>YAFATO</h1>
            <h2 className={styles.heading}>A light that never leaves</h2>
            <p className={styles.subheading}>
              A new era of silver is coming. Launching August 25.
            </p>
            <p className={styles.notice}>
              Be first. First 5 get 50% off — 10% for all new signups.
            </p>

            <NewsletterForm onSuccess={onSubscribed} />

            <div className={styles.socials}>
              <a href="https://instagram.com/Yafato_" target="_blank" rel="noreferrer">
                <FaInstagram /> Instagram
              </a>
              <a href="https://tiktok.com/@Yafato_" target="_blank" rel="noreferrer">
                <FaTiktok /> TikTok
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
