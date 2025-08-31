import { useState } from "react";
import styles from "./NewsletterForm.module.scss";

export default function NewsletterForm({ source = "coming-soon" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

async function subscribeNewsletterREST(cleanEmail, src) {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/subscribe_newsletter`;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({ p_email: cleanEmail, p_source: src }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`RPC ${res.status}: ${text}`);
    }
    return res.json(); // row or [row]
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setMessage("");
    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return setMessage("Please enter a valid email address.");
    }

    setLoading(true);
    try {
      // ❗ Replace the supabase.rpc(...) call with the REST helper:
      const data = await subscribeNewsletterREST(cleanEmail, source);

      const row = Array.isArray(data) ? data[0] : data;
      if (!row?.email) throw new Error("Subscription did not return a record.");

      const code = row.discount_code || "YAFATO10la";

      // Feedback to user
      if (code === "SaYafato50#") {
        setMessage("🎉 Welcome! You're one of the first 5! Use code SaYafato50# at checkout.");
      } else {
        setMessage("💌 Welcome! Use code YAFATO10la for 10% off your first order.");
      }

      // Fire the welcome email (Edge Function)
      try {
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-welcome`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, discount_code: code }),
        });
        if (!res.ok) console.warn("send-welcome failed:", await res.text());
      } catch (mailErr) {
        console.warn("send-welcome error:", mailErr);
      }

      setEmail("");
    } catch (err) {
      console.error("Subscribe error:", err);
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
      />
      <button type="submit" className={styles["newsletter-btn"]} disabled={loading}>
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
      {message && <p className={styles["newsletter-message"]}>{message}</p>}
    </form>
  );
}
