import React, { useState } from "react";
import { supabase } from "../../supabse/Client";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      // Check if email already exists
      const { count, error: countError } = await supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact", head: true })
        .eq("email", email);

      if (countError) throw countError;

      if (count > 0) {
        setMessage("This email is already subscribed.");
      } else {
        // Insert new subscriber
        const { error: insertError } = await supabase
          .from("newsletter_subscribers")
          .insert([{ email }]);
        if (insertError) throw insertError;

        // Give discount code to first 5 subscribers
        const { count: totalCount } = await supabase
          .from("newsletter_subscribers")
          .select("*", { count: "exact", head: true });

        if (totalCount && totalCount <= 5) {
          setMessage(
            "🎉 Welcome! You're one of the first 5! Use code SaYafato50# at checkout."
          );
        } else {
          setMessage(
            "💌 Welcome! Use code YAFATO10la for 10% off your first order."
          );
        }
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
    <form
      onSubmit={handleSubmit}
      className="newsletter-form text-center"
    >
      <div className="mb-3">
        <input
          type="email"
          className="form-control newsletter-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="btn newsletter-btn"
        disabled={loading}
      >
        {loading ? "Subscribing..." : "Notify Me"}
      </button>

      {message && (
        <p className="message mt-3">{message}</p>
      )}
    </form>
  );
}
