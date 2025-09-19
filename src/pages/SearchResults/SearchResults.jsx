import React, { useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";
import flattenProducts, { searchProducts } from "../../utils/flattenProducts";
import styles from "./SearchResults.module.scss";

export default function SearchResults() {
  const { search } = useLocation();
  const { products } = useCatalog();
  const q = new URLSearchParams(search).get("q") || "";
  const list = useMemo(() => flattenProducts(products), [products]);
  const items = useMemo(() => searchProducts(list, q), [list, q]);
  useEffect(() => { window.scrollTo(0, 0); }, [q]);

  return (
    <section className={styles.wrap}>
      <header className={styles.header}>
        <h2>
          Search: <span className={styles.query}>“{q}”</span>
          <small className={styles.count}>{items.length}</small>
        </h2>
      </header>

      {items.length === 0 && <p className={styles.empty}>No products found.</p>}

      <div className={styles.grid}>
        {items.map((p) => {
          const path = p.handle ? `/products/${p.handle}` : `/products/${(p.id || "").split("/").pop()}`;
          return (
            <Link key={p.id || p.handle} to={path} className={styles.card}>
              <div className={styles.media}>
                {p.image ? <img src={p.image} alt={p.title} /> : <div className={styles.placeholder} />}
              </div>
              <div className={styles.meta}>
                <h4 className={styles.title}>{p.title}</h4>
                <p className={styles.price}>
                  {p.price ? `${Number(p.price).toFixed(2)} ${p.currency || "GBP"}` : ""}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
