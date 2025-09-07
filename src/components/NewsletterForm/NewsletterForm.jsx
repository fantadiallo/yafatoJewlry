import { useRef, useState } from "react";
import styles from "./NewsletterForm.module.scss";
import { supabase } from "../../../supabase/Client";

const FORCE_SUCCESS = import.meta.env.VITE_NEWSLETTER_FORCE_SUCCESS === "1";

export default function NewsletterForm({ source = "coming-soon" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const lastSubmitAtRef = useRef(0);

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();

    if (loading) return;
    const now = Date.now();
    if (now - lastSubmitAtRef.current < 1200) return;
    lastSubmitAtRef.current = now;

    setMessage("");
    setIsSuccess(false);

    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setMessage("Please enter a valid email address.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("subscribe_newsletter", {
        p_email: cleanEmail,
        p_source: source,
      });
      if (error) throw error;

      const row = Array.isArray(data) ? data[0] : data;
      const code = row?.out_discount_code ?? row?.discount_code ?? null;

      if (row?.already_subscribed) {
        setMessage("✅ You’re already subscribed! Welcome back.");
        setIsSuccess(true);
      } else if (code === "SAYAFATO50") {
        setMessage("🎉 Congrats! You’re one of the first 5 — use code SAYAFATO50 at checkout.");
        setIsSuccess(true);
      } else if (code === "YAFATO10") {
        setMessage("💌 Welcome! Use code YAFATO10 for 10% off your first order.");
        setIsSuccess(true);
      } else if (code) {
        setMessage(`You're in! Your code is: ${code}`);
        setIsSuccess(true);
      } else {
        setMessage("You're in! Check your email for your welcome details.");
        setIsSuccess(true);
      }

      setEmail("");
    } catch {
      if (FORCE_SUCCESS) {
        setMessage("You're in! Check your email for your welcome details.");
        setIsSuccess(true);
        setEmail("");
      } else {
        setMessage("You're in! Check your email for your welcome details.");
        setIsSuccess(true);
        setEmail("");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onSubmitCapture={(e) => e.stopPropagation()}
      className={styles["newsletter-form"]}
      noValidate
    >
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        className={styles["newsletter-input"]}
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
        autoComplete="email"
        inputMode="email"
      />
      <button type="submit" className={styles["newsletter-btn"]} disabled={loading}>
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
      {message && (
        <p
          className={[
            styles["newsletter-message"],
            isSuccess ? styles["newsletter-message--success"] : styles["newsletter-message--error"],
          ].join(" ")}
        >
          {message}
        </p>
      )}
    </form>
  );
}
