import styles from "./Policies.module.scss";


export default function Privacy() {
  return (
    <section className={styles.privacy}>
      <h1>Privacy Policy</h1>
      <p>We respect your privacy. We collect only what we need to process orders, support you, and improve Yafato.</p>
      <ul>
        <li>Data we collect: name, email, shipping details, and order history.</li>
        <li>Payments are processed by trusted providers; we never store card details.</li>
        <li>You may request access, correction, or deletion of your data at any time.</li>
      </ul>
      <p>Questions: contact <a href="mailto:yafatojewlry@gmail.com">yafatojewlry@gmail.com</a>.</p>
    </section>
  );
}
