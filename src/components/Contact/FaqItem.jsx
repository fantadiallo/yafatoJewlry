import { useState } from "react";
import styles from "./faqItem.module.scss";

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
