import { useState } from "react";
import styles from "./NewsletterForm.module.scss";
import { supabase } from "../../../supabase/Client";

const API_URL = import.meta.env.VITE_API_URL || "/";

export default function NewsletterForm({ source = "coming-soon" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [lastSubmitAt, setLastSubmitAt] = useState(0);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    // simple debounce
    const now = Date.now();
    if (now - lastSubmitAt < 1200) return;
    setLastSubmitAt(now);

    setMessage("");
    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // 1) Supabase RPC: assigns code & logs
      const { data, error } = await supabase.rpc("subscribe_newsletter", {
        p_email: cleanEmail,
        p_source: source,
      });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      const code = row?.discount_code;

      // 2) Shopify (server route)
      const r = await fetch(`${API_URL}api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, source }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j?.ok) {
        throw new Error(j?.error || `HTTP ${r.status}`);
      }

      // 3) Success message
      // If using double opt-in, consider:
      // setMessage("🙌 Thanks! Please check your email to confirm your subscription.");
      if (code === "SaYafato50") {
        setMessage("🎉 Congrats! You’re one of the first 5 — enjoy 50% off with code SaYafato50#");
      } else {
        setMessage("💌 Welcome! Use code YAFATO10la for 10% off your first order.");
      }
      setEmail("");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles["newsletter-form"]}>
      <input
        type="email"
        className={styles["newsletter-input"]}
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
        autoComplete="email"
      />
      <button type="submit" className={styles["newsletter-btn"]} disabled={loading}>
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
      {message && <p className={styles["newsletter-message"]}>{message}</p>}
    </form>
  );
}
