import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import FaqItem from "../../components/Contac/FaqItem";
import styles from "./ContactPage.module.scss";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;   // e.g. service_u2mmon2
const TEMPLATE_ID = "template_86onwbc";                       // your Contact Us template id
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function ContactForm() {
  const formRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (sending) return;

    setStatus("");
    setSending(true);

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
        publicKey: PUBLIC_KEY,
      });
      setStatus("✅ Message sent! We’ll reply within 24–48 hours.");
      formRef.current?.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("❌ Couldn’t send your message. Please try again soon.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className={styles.contactSection}>
      <div className={styles.intro}>
        <h1>Let’s Connect</h1>
        <p>
          Whether it’s a question, a collab idea, or just a message from your heart —
          we’d love to hear from you. We usually respond within 24–48 hours.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.faqBox}>
          <FaqItem
            question="What’s the meaning of silver in our culture?"
            answer="Silver protects from unseen energy and brings luck. It's a spiritual metal passed through generations."
          />
          <FaqItem question="Do you offer custom jewelry?" answer="Yes! Just attach your design — we’ll bring your vision to life." />
          <FaqItem question="What’s your return & resize policy?" answer="You may return or resize any piece within 14 days of receiving it." />
          <FaqItem question="How do I track my order?" answer="Once your order ships, we’ll send you a tracking link by email or WhatsApp." />
        </div>

        <div className={styles.formBox}>
          <h3>Send Us a Message 🤍</h3>

          <form
            ref={formRef}
            onSubmit={onSubmit}
            encType="multipart/form-data"
            className={styles.form}
          >
            {/* names MUST match your EmailJS template variables */}
            <input type="text"  name="name"  placeholder="Full name *" required />
            <input type="email" name="email" placeholder="Email *" required />

            <select name="subject" required defaultValue="">
              <option value="" disabled>Select a subject</option>
              <option value="Order Inquiry">Order Inquiry</option>
              <option value="Collaboration">Collaboration</option>
              <option value="Custom Request">Custom Request</option>
            </select>

            <textarea
              name="message"
              rows="5"
              placeholder="Your message *"
              required
            />

            <label className={styles.uploadLabel}>
              Attach image (optional)
              <input
                type="file"
                name="attachment"
                accept="image/*"
                className={styles.uploadInput}
              />
            </label>

            <button type="submit" disabled={sending}>
              {sending ? "Sending…" : "Send 🤍"}
            </button>

            {status && <p className={styles.status}>{status}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
