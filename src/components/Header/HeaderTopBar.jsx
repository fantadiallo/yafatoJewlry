import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Header.module.scss";

const TOP_MESSAGES = [
  "Free shipping in Scandinavia over €120",
  "Subscribe to our newslletter and get 10% off your first order",
];

export default function HeaderTopBar() {
  const [topIndex, setTopIndex] = useState(0);

  function prevTop() {
    setTopIndex((i) => (i - 1 + TOP_MESSAGES.length) % TOP_MESSAGES.length);
  }

  function nextTop() {
    setTopIndex((i) => (i + 1) % TOP_MESSAGES.length);
  }

  useEffect(() => {
    const id = setInterval(() => {
      setTopIndex((i) => (i + 1) % TOP_MESSAGES.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.topBar}>
      <div className={styles.topInner}>
        <div className={styles.announce}>
          <button className={styles.topArrow} type="button" aria-label="Previous message" onClick={prevTop}>
            ‹
          </button>

          <div className={styles.topTextWrap}>
            <AnimatePresence mode="wait">
              <motion.p
                key={topIndex}
                className={styles.topText}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
              >
                {TOP_MESSAGES[topIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <button className={styles.topArrow} type="button" aria-label="Next message" onClick={nextTop}>
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
