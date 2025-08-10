import { useState } from "react";
import { supabase } from "../../supabase/Client";
import styles from "./NewsletterForm.module.scss";

export default function NewsletterForm({ source = "coming-soon" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) return setMessage("Please enter a valid email address.");
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email: cleanEmail, source }])
        .select("discount_code")
        .single();

      if (error) {
        if (error.code === "23505") setMessage("This email is already subscribed.");
        else setMessage("Something went wrong. Try again later.");
      } else {
        const code = data?.discount_code;
        if (code === "SaYafato50#")
          setMessage("🎉 Welcome! You're one of the first 5! Use code SaYafato50# at checkout.");
        else setMessage("💌 Welcome! Use code YAFATO10la for 10% off your first order.");
        setEmail("");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`${styles["newsletter-form"]} text-center`}>
      <div className="mb-3">
        <input
          type="email"
          className={styles["newsletter-input"]}
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <button type="submit" className={styles["newsletter-btn"]} disabled={loading}>
        {loading ? "Subscribing..." : "Subscribe !"}
      </button>
      {message && <p className="message mt-3">{message}</p>}
    </form>
  );
}
