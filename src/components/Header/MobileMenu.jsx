import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Header.module.scss";

export default function MobileMenu({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={styles.menuOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.nav
            className={styles.mobileMenu}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            aria-label="Mobile menu"
          >
            <div className={styles.menuHeader}>
              <img src="/yafato.png" alt="Yafato Logo" />
              <button onClick={onClose} aria-label="Close menu" type="button">
                <FiX />
              </button>
            </div>

            <Link to="/products" onClick={onClose}>
              All
            </Link>
            <Link to="/products?sort=new" onClick={onClose}>
              New in
            </Link>
            <Link to="/products?type=rings" onClick={onClose}>
              Rings
            </Link>
            <Link to="/products?type=necklaces" onClick={onClose}>
              Necklaces
            </Link>
            <Link to="/products?type=bracelets" onClick={onClose}>
              Bracelets
            </Link>
            <Link to="/products?tag=for-him" onClick={onClose}>
              For him
            </Link>
            <Link to="/products?material=gold" onClick={onClose}>
              Gold
            </Link>
            <Link to="/products?material=silver" onClick={onClose}>
              Silver
            </Link>
            <Link to="/about" onClick={onClose}>
              About
            </Link>
            <Link to="/contact" onClick={onClose}>
              Contact
            </Link>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
