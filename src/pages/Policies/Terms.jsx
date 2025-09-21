import styles from "./Policies.module.scss";

export default function Terms() {
  return (
    <section className={styles.terms}>
      <h1>Terms & Conditions</h1>
      <p>These terms govern your use of our site and purchases from Yafato.</p>
      <ul>
        <li>Orders are subject to availability and confirmation of payment.</li>
        <li>Prices include VAT where applicable; shipping shown at checkout.</li>
        <li>Misprints or errors may be corrected; you will be notified if affected.</li>
      </ul>
    </section>
  );
}
