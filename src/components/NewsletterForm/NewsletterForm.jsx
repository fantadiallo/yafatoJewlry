import { useState } from "react";
import styles from "./NewsletterForm.module.scss";
import { supabase } from "../../../supabase/Client";

// Feature flag: flip to "true" later to re-enable the server/API call
const USE_SHOPIFY = import.meta.env.VITE_USE_SHOPIFY === "true";
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
      // 1) Supabase RPC: assigns discount code & logs
      const { data, error } = await supabase.rpc("subscribe_newsletter", {
        p_email: cleanEmail,
        p_source: source,
      });
      if (error) throw error;

      const row = Array.isArray(data) ? data[0] : data;
      const code = row?.discount_code;

      // 2) Shopify call — only when explicitly enabled
      if (USE_SHOPIFY) {
        try {
          const r = await fetch(`${API_URL}api/subscribe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: cleanEmail, source }),
          });
          const j = await r.json().catch(() => ({}));
          if (!r.ok || !j?.ok) {
            console.warn("Shopify subscribe failed:", j || r.status);
          }
        } catch (e) {
          console.warn("Shopify subscribe error:", e);
        }
      }

      // 3) Success message from actual code returned
      if (code === "SAYAFATO50") {
        setMessage("🎉 Congrats! You’re one of the first 5 — enjoy 50% off with code SAYAFATO50");
      } else if (code === "YAFATO10") {
        setMessage("💌 Welcome! Use code YAFATO10 for 10% off your first order.");
      } else if (code) {
        setMessage(`You're in! Your code is: ${code}`);
      } else {
        setMessage("You're in! Check your email for your welcome details.");
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
        <p className={styles["newsletter-message"]} role="status" aria-live="polite">
          {message}
        </p>
      )}
    </form>
  );
}

