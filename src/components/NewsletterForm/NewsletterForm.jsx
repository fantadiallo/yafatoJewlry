import { useRef, useState } from "react";
import styles from "./NewsletterForm.module.scss";

/**
 * NewsletterForm Component
 * Sends email directly to Shopify via Storefront API.
 * Creates customer with acceptsMarketing: true
 */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const lastSubmitAtRef = useRef(0);

  function normalizeEmail(v) {
    return v.trim().toLowerCase();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    // Prevent rapid submits
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
      const response = await fetch(
        `https://${import.meta.env.VITE_SHOPIFY_DOMAIN}/api/${import.meta.env.VITE_SHOPIFY_API_VERSION}/graphql.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token":
              import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
          },
          body: JSON.stringify({
            query: `
              mutation customerCreate($input: CustomerCreateInput!) {
                customerCreate(input: $input) {
                  customer {
                    id
                  }
                  customerUserErrors {
                    field
                    message
                  }
                }
              }
            `,
            variables: {
              input: {
                email: cleanEmail,
                acceptsMarketing: true,
              },
            },
          }),
        }
      );

      const result = await response.json();

      const errors = result?.data?.customerCreate?.customerUserErrors || [];

      if (errors.length > 0) {
        const errorMessage = errors[0].message.toLowerCase();

        if (errorMessage.includes("taken")) {
          setMessage("✅ You’re already subscribed! Welcome back.");
        } else {
          setMessage(errors[0].message);
        }
      } else {
        setMessage("💌 You’re in! Check your email for your welcome gift.");
        setEmail("");
      }
    } catch (err) {
      console.error("Shopify Newsletter Error:", err);
      setMessage("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles["newsletter-form"]}
      noValidate
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>

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
        aria-invalid={
          message &&
          !loading &&
          !/^\S+@\S+\.\S+$/.test(email.trim().toLowerCase())
            ? "true"
            : "false"
        }
      />

      <button
        type="submit"
        className={styles["newsletter-btn"]}
        disabled={loading}
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>

      {message && (
        <p className={styles["newsletter-message"]} role="status">
          {message}
        </p>
      )}
    </form>
  );
}