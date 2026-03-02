import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Collection.module.scss";
import { fetchShopifyProducts } from "../../api/shopify";

export default function Collection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const data = await fetchShopifyProducts();
        if (!alive) return;
        setProducts(Array.isArray(data) ? data.filter(Boolean) : []);
      } catch {
        if (!alive) return;
        setProducts([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const formatPrice = (price) => {
    const value = Number(price);
    if (!Number.isFinite(value)) return "";
    return new Intl.NumberFormat("de-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (loading) {
    return (
      <section className={styles.sectionCollection} aria-label="Latest collection">
        <div className={styles.inner}>
          <div className={styles.topRow}>
            <div className={styles.leftTitle}>
              <p className={styles.kicker}>This is Yafato</p>
              <h2 className={styles.heading}>Latest collection</h2>
            </div>
            <p className={styles.rightLabel}>Old artisan craft</p>
          </div>

          <div className={styles.grid} aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`${styles.card} ${styles.skeletonCard}`}>
                <div className={styles.cardImageWrapper} />
                <div className={styles.cardInfo}>
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLineSmall} />
                  <div className={styles.skeletonLine} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className={styles.sectionCollection} aria-label="Latest collection">
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <div className={styles.leftTitle}>
            <p className={styles.kicker}>This is Yafato</p>
            <h2 className={styles.heading}>Latest collection</h2>
          </div>
          <p className={styles.rightLabel}>Old artisan craft</p>
        </div>

        <div className={styles.grid}>
          {products.map((product) => {
            const to = `/products/${product.handle || product.id}`;
            const material = (product.material || "925 Silver").toUpperCase();
            const price = formatPrice(product.price);

            return (
              <Link key={product.id} to={to} className={styles.card}>
                <div className={styles.cardImageWrapper}>
                  <img
                    src={product.image}
                    alt={product.title}
                    className={styles.primaryImage}
                    loading="lazy"
                    decoding="async"
                  />

                  {product.secondaryImage && (
                    <img
                      src={product.secondaryImage}
                      alt=""
                      className={styles.secondaryImage}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>

                <div className={styles.cardInfo}>
                  <p className={styles.cardTitle}>{product.title}</p>
                  <p className={styles.cardSub}>{material}</p>
                  {price && <p className={styles.cardPrice}>{price}</p>}
                </div>
              </Link>
            );
          })}
        </div>

        <div className={styles.ctaRow}>
          <Link to="/products" className={styles.ctaButton}>
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}
