import styles from "./Policies.module.scss";

export default function Legal() {
  return (
    <section className={styles.legal}>
      <h1>Legal</h1>
      <p>Yafato — a Scandinavian brand rooted in West African heritage.</p>
      <ul>
        <li>Primary contact: <a href="mailto:yafatojewlry@gmail.com">yafatojewlry@gmail.com</a></li>
        <li>Materials: primarily Silver 925; optional gold/bronze accents on request.</li>
        <li>All rights reserved.</li>
      </ul>
    </section>
  );
}
