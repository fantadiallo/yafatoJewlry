import styles from "./Policies.module.scss";


export default function Exchange() {
  return (
    <main className={styles.exchange}>
      <h1>Exchange Policy (No Refunds)</h1>
      <p>You may request an exchange within 7 days of delivery.</p>
      <ul>
        <li>Items must be unused, unworn, and in original packaging.</li>
        <li>Customers are responsible for return shipping costs.</li>
        <li>After inspection, we issue store credit or an exchange of equal value.</li>
      </ul>
      <p>Start an exchange: yafatojewlry@gmail.com</p>
      <p>Last updated: 20 Sep 2025</p>
    </main>
  );
}

