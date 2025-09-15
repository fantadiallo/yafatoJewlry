import FaqItem from "../../components/Contac/FaqItem";
import styles from "./ContactPage.module.scss";

export default function ContactForm() {
  return (
    <section className={styles.contactSection}>
      <div className={styles.intro}>
        <h1>Let’s Connect</h1>
        <p>
          Questions, collaborations, or custom ideas we’d love to hear from you.
          We usually reply within 24–48 hours.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.faqBox}>
<FaqItem
  question="What’s the meaning of silver in our culture?"
  answer="Silver is often gifted from an early age, especially to children, because it’s seen as a pure and timeless metal. It carries a sense of care, heritage, and continuity, passed on through generations as a symbol of lasting value."
/>
<FaqItem
  question="Do you offer custom jewelry?"
  answer="Yes. Share your idea or reference image and we’ll design a piece around your vision. We craft in Silver 925, with optional gold or bronze accents when requested."
/>
<FaqItem
  question="What’s your return & resize policy?"
  answer="You may request a return or resize within 14 days of receiving your item, provided it’s unworn and in original condition. Custom engravings or highly personalized designs may have limitations — we’ll clarify before production."
/>
<FaqItem
  question="How do I track my order?"
  answer="Once your order ships, we’ll send you a tracking link by email or WhatsApp, so you can follow your piece all the way to delivery."
/>
<FaqItem
  question="What materials do you use?"
  answer="We primarily use Silver 925 for all pieces, with optional bronze or gold accents upon request. Every material is selected for durability, comfort, and beauty."
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
              <option value="returns">Return / Resize</option>
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

            <button type="submit" aria-label="Send message">Send 🤍</button>
          </form>
        </div>
      </div>
    </section>
  );
}
