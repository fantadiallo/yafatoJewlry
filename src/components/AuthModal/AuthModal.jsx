import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./AuthModal.module.scss";

export default function AuthModal({ isOpen, onClose }) {
  const [tab, setTab] = useState("login");

  useEffect(() => {
    const { body, documentElement } = document;
    if (isOpen) {
      const prevBody = body.style.overflow;
      const prevRoot = documentElement.style.overflow;
      body.style.overflow = "hidden";
      documentElement.style.overflow = "hidden";
      return () => {
        body.style.overflow = prevBody;
        documentElement.style.overflow = prevRoot;
      };
    }
  }, [isOpen]);

  const SHOP_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
  const SHOP_BASE = useMemo(() => {
    const d = String(SHOP_DOMAIN || "").replace(/^https?:\/\//i, "");
    return d ? `https://${d}` : "";
  }, [SHOP_DOMAIN]);

  const returnUrl = useMemo(() => {
    const here = window.location.pathname + window.location.search + window.location.hash;
    return encodeURIComponent(here || "/");
  }, []);

  const loginUrl = SHOP_BASE ? `${SHOP_BASE}/account/login?return_url=${returnUrl}` : "#";
  const registerUrl = SHOP_BASE ? `${SHOP_BASE}/account/register?return_url=${returnUrl}` : "#";
  const recoverUrl = SHOP_BASE ? `${SHOP_BASE}/account/login#recover` : "#";

  function go() {
    if (!SHOP_BASE) return;
    window.location.href = tab === "login" ? loginUrl : registerUrl;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label={tab === "login" ? "Sign in" : "Create account"}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
          >
            <div className={styles.header}>
              <button
                className={tab === "login" ? styles.activeTab : styles.tab}
                onClick={() => setTab("login")}
              >
                Sign in
              </button>
              <button
                className={tab === "register" ? styles.activeTab : styles.tab}
                onClick={() => setTab("register")}
              >
                Create account
              </button>
              <button className={styles.close} onClick={onClose} aria-label="Close">×</button>
            </div>

            <div className={styles.body}>
              <p className={styles.note}>
                You’ll be redirected to our secure Shopify {tab === "login" ? "login" : "registration"} page.
              </p>

              <button type="button" className={styles.submit} onClick={go}>
                {tab === "login" ? "Continue to Shopify Login" : "Continue to Shopify Register"}
              </button>

              {tab === "login" && (
                <p className={styles.subtle}>
                  <a href={recoverUrl}>Forgot your password?</a>
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
