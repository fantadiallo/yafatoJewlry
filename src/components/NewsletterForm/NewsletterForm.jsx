import { useState } from "react";
import styles from "./NewsletterForm.module.scss";
import { supabase } from "../../supabse/Client";


export default function NewsletterForm({ source = "coming-soon" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
      // ✅ Call Supabase RPC
      const { data, error } = await supabase.rpc("subscribe_newsletter", {
        p_email: cleanEmail,
        p_source: source,
      });

      if (error) {
        if (error.code === "23505") {
          setMessage("✅ You're already subscribed with this email.");
          return;
        }
        throw error;
      }

      const row = Array.isArray(data) ? data[0] : data;
      if (!row?.email) {
        throw new Error("Subscription did not return a record.");
      }

      const code = row.discount_code || "YAFATO10la";

      // ✅ User-facing message
      if (code === "SaYafato50#") {
        setMessage("🎉 Welcome! You're one of the first 5! Use code SaYafato50# at checkout.");
      } else {
        setMessage("💌 Welcome! Use code YAFATO10la for 10% off your first order.");
      }

      // ✅ Send welcome email (Edge Function)
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-welcome`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: cleanEmail, discount_code: code }),
          }
        );
        if (!res.ok) {
          console.warn("send-welcome failed:", await res.text());
        }
      } catch (mailErr) {
        console.warn("send-welcome error:", mailErr);
      }

      setEmail("");
    } catch (err) {
      console.error("Subscribe error:", err?.message, err?.code, err);
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
      <button
        type="submit"
        className={styles["newsletter-btn"]}
        disabled={loading}
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
      {message && <p className={styles["newsletter-message"]}>{message}</p>}
    </form>
  );
}
