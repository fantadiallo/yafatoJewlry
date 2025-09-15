import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./AuthModal.module.scss";
import { customerLogin, customerRegister } from "../../api/shopify";

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [tab, setTab] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (tab === "login") {
        const token = await customerLogin(email, password);
        onSuccess?.(token);
        onClose();
      } else {
        await customerRegister({ email, password, firstName, lastName });
        const token = await customerLogin(email, password);
        onSuccess?.(token);
        onClose();
      }
    } catch (e) {
      setErr(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
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

            <form onSubmit={onSubmit} className={styles.form}>
              {tab === "register" && (
                <div className={styles.row2}>
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                  />
                </div>
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={tab === "login" ? "current-password" : "new-password"}
                required
              />

              {err && <p className={styles.error} role="alert">{err}</p>}

              <button type="submit" className={styles.submit} disabled={loading}>
                {loading ? "Please wait…" : tab === "login" ? "Sign in" : "Create account"}
              </button>
            </form>

            <p className={styles.note}>
              We never share your details. You can view orders and manage your account after signing in.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
