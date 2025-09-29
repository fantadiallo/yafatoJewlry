import { useRef, useState } from "react";
import styles from "./NewsletterForm.module.scss";
import { supabase } from "../../supabase/Client";

/**
 * NewsletterForm Component
 *
 * Renders an email subscription form connected to Supabase via an RPC function (`subscribe_newsletter`).
 * Handles validation, throttling, and feedback messages for users subscribing to the newsletter.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.source="coming-soon"] - Optional identifier for tracking where the subscription originated (e.g., "homepage", "popup").
 * @returns {JSX.Element} Rendered newsletter subscription form.
 */
export default function NewsletterForm({ source = "coming-soon" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const lastSubmitAtRef = useRef(0);

  /**
   * Normalize an email string (trim + lowercase).
   * @param {string} v - Input email.
   * @returns {string} Normalized email.
   */
  function normalizeEmail(v) {
    return v.trim().toLowerCase();
  }

  /**
   * Normalize the subscription source (limit to 64 chars).
   * @param {string} v - Input source.
   * @returns {string} Normalized source string.
   */
  function normalizeSource(v) {
    return String(v || "coming-soon").slice(0, 64);
  }

  /**
   * Handle form submission.
   * Validates email, throttles repeated submissions, calls Supabase RPC, 
   * and sets appropriate feedback messages (including discount codes).
   *
   * @async
   * @param {React.FormEvent<HTMLFormElement>} e - Form submit event.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    // Prevent rapid-fire submits
    const now = Date.now();
    if (now - lastSubmitAtRef.current < 1200) return;
    lastSubmitAtRef.current = now;

    setMessage("");
    const cleanEmail = normalizeEmail(email);

    // Basic email validation
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

      // Handle different subscription states
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
