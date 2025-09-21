import styles from "./Policies.module.scss";

export default function Shipping() {
  return (
    <section className={styles.shipping}>
      <h1>Shipping Policy</h1>
      <p>We ship from Norway. Processing typically 1–3 business days.</p>
      <ul>
        <li>Tracking is emailed once your order ships.</li>
        <li>International orders may incur customs or import fees.</li>
        <li>Please ensure your address is accurate to avoid delays.</li>
      </ul>
    </section>
  );
}
