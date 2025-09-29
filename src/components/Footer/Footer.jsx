import React from "react";
import { Link } from "react-router-dom";
import { FiInstagram, FiMail, FiPhone } from "react-icons/fi";
import { SiVisa, SiMastercard, SiApplepay, SiPaypal, SiTiktok } from "react-icons/si";
import styles from "./Footer.module.scss";

/**
 * Footer Component
 *
 * Provides the global footer for the site, including:
 * - Brand name and tagline.
 * - Primary navigation links (Jewelry, About, Contact, FAQ, Newsletter).
 * - Contact info (email, phone).
 * - Social links (Instagram, TikTok).
 * - Policy links (privacy, terms, shipping, returns/exchanges, legal).
 * - Payment method icons (Visa, Mastercard, Apple Pay, PayPal).
 * - Copyright.
 *
 * Accessibility:
 * - Uses `aria-label` on navigation and social/payment sections.
 * - Provides accessible labels for icons and links.
 *
 * @component
 * @returns {JSX.Element} The rendered site footer with navigation, policies, contact info, and branding.
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Top section: brand, nav, contact */}
      <div className={styles.top}>
        <div className={styles.brand}>
          <h2>YAFATO</h2>
          <p className={styles.tagline}>light that never leaves</p>
        </div>

        {/* Primary navigation */}
        <nav className={styles.links} aria-label="Primary">
          <Link to="/products">Jewelry</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/newsletter">Newsletter</Link>
        </nav>

        {/* Contact and social */}
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

      {/* Policies row */}
      <div className={styles.policyRow}>
        <nav className={styles.policyLinks} aria-label="Policies">
          <Link to="/policies/privacy">Privacy</Link>
          <Link to="/policies/terms">Terms</Link>
          <Link to="/policies/shipping">Shipping</Link>
          <Link to="/policies/exchange">Return/Exchange</Link>
          <Link to="/policies/legal">Legal</Link>
        </nav>
      </div>

      {/* Bottom section: copyright and payments */}
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
