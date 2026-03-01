import { Link } from "react-router-dom";
import styles from "./signatur.module.scss";

export default function Signatur() {
  return (
    <section className={styles.signatur}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.kicker}>YAFATO SIGNATURE</span>
          <h2>Our Signature Bracelets</h2>
          <p>
            The pieces that define Yafato. Handcrafted in sterling silver,
            designed to be worn daily and carried for years.
          </p>

          <Link to="/products?type=bracelets" className={styles.cta}>
            Explore bracelets
          </Link>
        </div>

        <div className={styles.visuals}>
          <div className={styles.card}>
            <img src="https://cdn.shopify.com/s/files/1/0952/4261/7177/files/IMG_8756.jpg?v=1772042789" alt="Yafato signature bracelet" />
          </div>
          <div className={styles.card}>
            <img src="https://cdn.shopify.com/s/files/1/0952/4261/7177/files/IMG_8758.jpg?v=1772042017" alt="Yafato signature bracelet" />
          </div>
          <div className={styles.card}>
            <img src="https://cdn.shopify.com/s/files/1/0952/4261/7177/files/IMG_8757.jpg?v=1772042018" alt="Yafato signature bracelet" />
          </div>
        </div>
      </div>
    </section>
  );
}
