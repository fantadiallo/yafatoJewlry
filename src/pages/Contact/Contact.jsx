import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import styles from "./ContactPage.module.scss";
import FaqItem from "../../components/Contact/FaqItem";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TPL_CONTACT;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function ContactForm() {
  const formRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (PUBLIC_KEY) {
      emailjs.init(PUBLIC_KEY);
    }
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (sending) return;

    setStatus("");
    setSending(true);

    try {
      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        throw new Error("Missing EmailJS env vars.");
      }

      const res = await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        { publicKey: PUBLIC_KEY }
      );

      if (res?.status === 200) {
        setStatus("✅ Message sent! We’ll reply within 24–48 hours.");
        formRef.current?.reset();
      } else {
        throw new Error(
          `Unexpected response: ${res?.status} ${res?.text || ""}`
        );
      }
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
          Questions, collaborations, or custom ideas — we’d love to hear from
          you. 
        </p>
        <p>
          For custom ideas, just send us an email at{" "}
          <a href="mailto:yafatojewlry@gmail.com">yafatojewlry@gmail.com</a>
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.faqBox}>
          <FaqItem
            question="What’s the meaning of silver in our culture?"
            answer="Silver is often gifted from an early age…"
          />
          <FaqItem
            question="Do you offer custom jewelry?"
            answer="Yes. Share your idea… yafatojewlry@gmail.com"
          />
          <FaqItem
            question="What’s your return & resize policy?"
            answer="You may request a return…"
          />
          <FaqItem question="How do I track my order?" answer="Once your order ships…" />
          <FaqItem
            question="What materials do you use?"
            answer="We primarily use Silver 925…"
          />
        </div>

        <div className={styles.formBox}>
          <h3>Send Us a Message 🤍</h3>

          <form
            ref={formRef}
            onSubmit={onSubmit}
            encType="multipart/form-data"
            className={styles.form}
          >
            <input
              type="text"
              name="name"
              placeholder="Full name *"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email *"
              required
            />

            <select name="subject" required defaultValue="">
              <option value="" disabled>
                Select a subject
              </option>
              <option value="Order Inquiry">Order Inquiry</option>
              <option value="Collaboration">Collaboration</option>
              <option value="Custom Request">Custom Request</option>
              <option value="Return / Resize">Return / Resize</option>
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
                name="my_file"
                accept="image/*"
                className={styles.uploadInput}
              />
            </label>

            <input
              type="hidden"
              name="time"
              value={new Date().toLocaleString()}
            />

            <button
              type="submit"
              disabled={sending}
              aria-label="Send message"
            >
              {sending ? "Sending…" : "Send 🤍"}
            </button>

            {status && <p className={styles.status}>{status}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
