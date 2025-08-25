import { useState } from "react";
import styles from "./NewsletterForm.module.scss";
import { supabase } from "../../supabase/Client";

/**
 * NewsletterForm component allows users to subscribe to the newsletter.
 * - Validates email input.
 * - Calls a Supabase RPC to subscribe the user and get a discount code.
 * - Displays a message based on the discount code returned.
 * - Attempts to send a welcome email (does not block UI on failure).
 *
 * @param {Object} props
 * @param {string} [props.source="coming-soon"] - Source identifier for the subscription.
 * @returns {JSX.Element}
 */
export default function NewsletterForm({ source = "coming-soon" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /**
   * Handles the newsletter form submission.
   * - Prevents double submits.
   * - Validates email.
   * - Calls Supabase RPC and handles response.
   * - Shows user-facing messages.
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;           // guard: no double submits
    setMessage("");
    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return setMessage("Please enter a valid email address.");
    }

    setLoading(true);
    try {
      // Call Supabase RPC to subscribe
      const { data, error } = await supabase.rpc('subscribe_newsletter', {
        p_email: cleanEmail,
        p_source: source
      });
      if (error) throw error;

      // Validate response
      const row = Array.isArray(data) ? data[0] : data;
      if (!row?.email) {
        throw new Error("Subscription did not return a record.");
      }
      const code = row.discount_code || "YAFATO10la";

      // Show user-facing message
      if (code === "SaYafato50#") {
        setMessage("🎉 Welcome! You're one of the first 5! Use code SaYafato50# at checkout.");
      } else {
        setMessage("💌 Welcome! Use code YAFATO10la for 10% off your first order.");
      }

      // Try to send welcome email (non-blocking)
      try {
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-welcome`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, discount_code: code })
        });
        if (!res.ok) {
          console.warn('send-welcome failed:', await res.text());
        }
      } catch (mailErr) {
        console.warn('send-welcome error:', mailErr);
      }

      setEmail("");
    } catch (err) {
      console.error('Subscribe error:', err?.message, err?.code, err);
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
