import styles from "./Logo.module.scss";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className={styles.logo} aria-label="YAFATO Home">
      <img src="/yafato.png" alt="Yafato Logo" className={styles.logoImage} />
    </Link>
  );
}