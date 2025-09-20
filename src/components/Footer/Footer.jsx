import React from "react";
import { Link } from "react-router-dom";
import { FiInstagram, FiMail, FiPhone } from "react-icons/fi";
import { SiVisa, SiMastercard, SiApplepay, SiPaypal, SiTiktok } from "react-icons/si";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <h2>YAFATO</h2>
          <p className={styles.tagline}>light that never leaves</p>
        </div>

        <nav className={styles.links} aria-label="Primary">
          <Link to="/products">Jewelry</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/newsletter">Newsletter</Link>
        </nav>

        <div className={styles.contact}>
          <p>
            <FiMail aria-hidden="true" />
            <a href="mailto:yafatojewlry@gmail.com">yafatojewlry@gmail.com</a>
          </p>
          <p>
            <FiPhone aria-hidden="true" />
            <a href="tel:+4794464132">+47 944 64 132</a>
          </p>
          <div className={styles.social}>
            <a
              href="https://instagram.com/yafato_"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              <FiInstagram />
            </a>
            <a
              href="https://www.tiktok.com/@yafatojewellery"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              title="TikTok"
            >
              <SiTiktok />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.policyRow}>
        <nav className={styles.policyLinks} aria-label="Policies">
          <Link to="/policies/privacy">Privacy</Link>
          <Link to="/policies/terms">Terms</Link>
          <Link to="/policies/shipping">Shipping</Link>
          <Link to="/policies/exchange">Exchange</Link>
          <Link to="/policies/legal">Legal</Link>
        </nav>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Yafato. All rights reserved.</p>
        <div className={styles.payments} aria-label="Payment methods">
          <span className={styles.paymentIcon} data-brand="visa" aria-label="Visa" title="Visa">
            <SiVisa aria-hidden="true" />
          </span>
          <span className={styles.paymentIcon} data-brand="mastercard" aria-label="Mastercard" title="Mastercard">
            <SiMastercard aria-hidden="true" />
          </span>
          <span className={styles.paymentIcon} data-brand="applepay" aria-label="Apple Pay" title="Apple Pay">
            <SiApplepay aria-hidden="true" />
          </span>
          <span className={styles.paymentIcon} data-brand="paypal" aria-label="PayPal" title="PayPal">
            <SiPaypal aria-hidden="true" />
          </span>
        </div>
      </div>
    </footer>
  );
}
