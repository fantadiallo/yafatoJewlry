import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./Header.module.scss";

export default function SearchPanel({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={styles.searchOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className={styles.searchPanel}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            aria-label="Search panel"
          >
            <div className={styles.searchHeader}>
              <strong>Search</strong>
              <button className={styles.panelClose} onClick={onClose} aria-label="Close search" type="button">
                <FiX />
              </button>
            </div>

            <div className={styles.searchBody}>
              <SearchBar autoFocus />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
