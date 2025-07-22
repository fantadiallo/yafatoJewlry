import React from "react";
import { Link } from "react-router-dom";
import { FiInstagram, FiTwitter, FiMail, FiPhone } from "react-icons/fi";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerContainer} container`}>
        {/* Branding */}
        <div className={styles.brand}>
          <h2>YAFATO</h2>
          <p>Timeless luxury. Futuristic style.</p>
        </div>

        {/* Navigation Links */}
        <div className={styles.links}>
          <h4>Explore</h4>
          <ul>
            <li><Link to="/jewelry">Jewelry</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className={styles.contact}>
          <h4>Contact</h4>
          <ul>
            <li><FiMail /> shes.fato@gmail.com</li>
            <li><FiPhone /> +47 (944) 64 132</li>
          </ul>
        </div>

        {/* Social Media */}
        <div className={styles.social}>
          <h4>Follow Us</h4>
          <div className={styles.icons}>
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} Yafato. All rights reserved.</p>
      </div>
    </footer>
  );
}
