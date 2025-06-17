import { useState } from "react";
import { supabase } from "../../supabse/Client";
import styles from "./NewsletterForm.module.scss";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      setMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const { count, error: countError } = await supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact", head: true })
        .eq("email", cleanEmail);

      if (countError) throw countError;

      if (count > 0) {
        setMessage("This email is already subscribed.");
      } else {
        const { count: totalCount, error: countTotalError } = await supabase
          .from("newsletter_subscribers")
          .select("*", { count: "exact", head: true });

        if (countTotalError) throw countTotalError;

        const discount_code =
          totalCount && totalCount < 5
            ? "SaYafato50#"
            : "YAFATO10la";

        const { error: insertError } = await supabase
          .from("newsletter_subscribers")
          .insert([{ email: cleanEmail, discount_code }]);

        if (insertError) throw insertError;

        setMessage(
          discount_code === "SaYafato50#"
            ? "🎉 Welcome! You're one of the first 5! Use code SaYafato50# at checkout."
            : "💌 Welcome! Use code YAFATO10la for 10% off your first order."
        );

        setEmail("");
      }
    } catch (err) {
      setMessage("Something went wrong. Try again later.");
      console.error(err);
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
        />
      </div>

      <button
        type="submit"
        className={styles["newsletter-btn"]}
        disabled={loading}
      >
        {loading ? "Subscribing..." : "Subscribe !"}
      </button>

      {message && (
        <p className="message mt-3">{message}</p>
      )}
    </form>
  );
}
