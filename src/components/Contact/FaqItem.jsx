import { useState } from "react";
import styles from "./faqItem.module.scss";

/**
 * FaqItem Component
 *
 * Renders a single FAQ item with a toggleable answer.  
 * Clicking the button expands or collapses the answer.  
 * Visual state is managed with a local `open` boolean.
 *
 * Accessibility:
 * - Uses a `<button>` to ensure keyboard and screen reader support.
 * - Expands/collapses content conditionally.
 *
 * @component
 * @param {Object} props
 * @param {string} props.question - The FAQ question text
 * @param {string|JSX.Element} props.answer - The FAQ answer text or markup
 * @returns {JSX.Element} A single FAQ item
 */
export default function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.faqItem} ${open ? styles.open : ""}`}>
      <button onClick={() => setOpen(!open)}>
        {question}
        <span>{open ? "–" : "+"}</span>
      </button>
      {open && <p className={styles.answer}>{answer}</p>}
    </div>
  );
}
