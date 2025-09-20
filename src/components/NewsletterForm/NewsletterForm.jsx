import { useRef, useState } from "react";
import styles from "./NewsletterForm.module.scss";
import { supabase } from "../../supabase/Client";

export default function NewsletterForm({ source = "coming-soon" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const lastSubmitAtRef = useRef(0);

  function normalizeEmail(v) {
    return v.trim().toLowerCase();
  }

  function normalizeSource(v) {
    return String(v || "coming-soon").slice(0, 64);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    const now = Date.now();
    if (now - lastSubmitAtRef.current < 1200) return;
    lastSubmitAtRef.current = now;

    setMessage("");
    const cleanEmail = normalizeEmail(email);
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("subscribe_newsletter", {
        p_email: cleanEmail,
        p_source: normalizeSource(source),
      });
      if (error) throw error;

      const row = Array.isArray(data) ? data[0] : data || {};
      const code = row.out_discount_code;

      if (row.already_subscribed) {
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
      console.error("Newsletter RPC error:", {
        message: err?.message,
        details: err?.details,
        hint: err?.hint,
        code: err?.code,
      });
      if (String(err?.message || "").toLowerCase().includes("already")) {
        setMessage("✅ You’re already subscribed! Welcome back.");
      } else {
        setMessage("Something went wrong. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles["newsletter-form"]} noValidate>
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
        aria-invalid={message && !loading && !/^\S+@\S+\.\S+$/.test(email.trim().toLowerCase()) ? "true" : "false"}
      />
      <button type="submit" className={styles["newsletter-btn"]} disabled={loading}>
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
      {message && <p className={styles["newsletter-message"]} role="status">{message}</p>}
    </form>
  );
}
