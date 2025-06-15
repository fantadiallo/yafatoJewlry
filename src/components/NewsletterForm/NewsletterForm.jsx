import React, { useState } from "react";
import styles from "./NewsletterForm.module.scss";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribed email:", email);
    setSubmitted(true);
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.fields}
          >
            <label htmlFor="newsletter" className="visually-hidden">
              Email address
            </label>
            <input
              id="newsletter"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
             subscribe
            </button>
          </motion.div>
        ) : (
          <motion.p
            key="success"
            className={styles.success}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            You're on the list! ✨
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
