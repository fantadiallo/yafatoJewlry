import { useRef, useState } from "react";
import styles from "./NewsletterForm.module.scss";
import { supabase } from "../../../supabase/Client";

// Toggle with an env var (set VITE_NEWSLETTER_FORCE_SUCCESS=1 in Vercel)
const FORCE_SUCCESS = import.meta.env.VITE_NEWSLETTER_FORCE_SUCCESS === "1";

export default function NewsletterForm({ source = "coming-soon" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const lastSubmitAtRef = useRef(0);

  async function handleSubmit(e) {
    // stop any rogue/global submit handlers
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();

    if (loading) return;
    const now = Date.now();
    if (now - lastSubmitAtRef.current < 1200) return; // debounce
    lastSubmitAtRef.current = now;

    setMessage("");
    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setMessage("Please enter a valid email address.");
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
      } else if (code === "SAYAFATO50") {
        setMessage("🎉 Congrats! You’re one of the first 5 — use code SAYAFATO50 at checkout.");
      } else if (code === "YAFATO10") {
        setMessage("💌 Welcome! Use code YAFATO10 for 10% off your first order.");
      } else if (code) {
        setMessage(`You're in! Your code is: ${code}`);
      } else {
        setMessage("You're in! Check your email for your welcome details.");
      }

      setEmail("");
    } catch (err) {
      if (FORCE_SUCCESS) {
        // 👇 Force friendly success if anything goes wrong
        setMessage("You're in! Check your email for your welcome details.");
        setEmail("");
      } else if (err?.code === "23505") {
        setMessage("✅ You’re already subscribed! Welcome back.");
      } else {
        console.error("Newsletter RPC error:", {
          message: err?.message, details: err?.details, hint: err?.hint, code: err?.code,
        });
        setMessage((prev) => prev || "Something went wrong. Try again later.");
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
      {message && <p className={styles["newsletter-message"]}>{message}</p>}
    </form>
  );
}
