import FaqItem from "../../components/Contac/FaqItem";
import styles from "./ContactPage.module.scss"; // For your custom styles

export default function ContactForm() {
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
          <FaqItem
            question="Do you offer custom jewelry?"
            answer="Yes! Just attach your design — we’ll bring your vision to life."
          />
          <FaqItem
            question="What’s your return & resize policy?"
            answer="You may return or resize any piece within 14 days of receiving it."
          />
          <FaqItem
            question="How do I track my order?"
            answer="Once your order ships, we’ll send you a tracking link by email or WhatsApp."
          />
        </div>

        <div className={styles.formBox}>
          <h3>Send Us a Message 🤍</h3>
        <form>
  <input type="text" name="name" placeholder="Full name *" required />
  <input type="email" name="email" placeholder="Email *" required />

  <select name="subject" required>
    <option value="">Select a subject</option>
    <option value="order">Order Inquiry</option>
    <option value="collab">Collaboration</option>
    <option value="custom">Custom Request</option>
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

  <button type="submit">Send 🤍</button>
</form>

        </div>
      </div>
    </section>
  );
}
