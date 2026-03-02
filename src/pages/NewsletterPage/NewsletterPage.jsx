import React from "react";
import styles from "./NewsletterPage.module.scss";
import NewsletterForm from "../../components/NewsletterForm/NewsletterForm";

export default function NewsletterPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <img
          src="/yafato.png"
          alt="Yafato Logo"
          className={styles.logo}
        />

        <h1 className={styles.title}>
          Join the Inner Circle
        </h1>

        <p className={styles.subtitle}>
          Be the first to access our launch collection.
        </p>

        <NewsletterForm source="launch-page" />
      </div>
    </div>
  );
}