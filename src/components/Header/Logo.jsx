import styles from "./Logo.module.scss";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className={styles.logo} aria-label="YAFATO Home">
      <span className={styles.yPart}>Y</span>
      <span className={styles.afatoPart}>aFato</span>
    </Link>
  );
}
