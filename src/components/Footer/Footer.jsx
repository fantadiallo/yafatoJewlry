import React from "react";
import { FiInstagram, FiTwitter, FiMail, FiPhone } from "react-icons/fi";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        {/* Brand */}
        <div className={styles.brand}>
          <h2>YAFATO</h2>
          <p>light that never leaves!</p>
        </div>

        {/* Quick Links */}
        <nav className={styles.links}>
          <a href="/jewelry">Jewelry</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/faq">FAQ</a>
        </nav>

        {/* Contact & Social */}
        <div className={styles.contact}>
          <p><FiMail /> support@yafato.com</p>
          <p><FiPhone /> +47 944 64 132</p>
          <div className={styles.social}>
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Yafato. All rights reserved.</p>
        <div className={styles.payments}>
          <img src="/assets/payments/visa.svg" alt="Visa" />
          <img src="/assets/payments/mastercard.svg" alt="Mastercard" />
          <img src="/assets/payments/applepay.svg" alt="Apple Pay" />
          <img src="/assets/payments/paypal.svg" alt="PayPal" />
        </div>
      </div>
    </footer>
  );
}
