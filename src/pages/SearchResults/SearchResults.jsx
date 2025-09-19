// SearchResults.jsx
import React, { useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "./SearchResults.module.scss";

export default function SearchResults({ products = [] }) {
  const { search } = useLocation();
  const q = new URLSearchParams(search).get("q") || "";

  const norm = (s) => (s || "").toString().toLowerCase().trim();

  const items = useMemo(() => {
    const needle = norm(q);
    if (!needle) return [];
    return products.filter((p) => {
      const title = norm(p.title);
      const handle = norm(p.handle);
      const vendor = norm(p.vendor);
      const tags = Array.isArray(p.tags) ? norm(p.tags.join(" ")) : "";
      return (
        title.startsWith(needle) ||
        title.includes(needle) ||
        handle.includes(needle) ||
        vendor.includes(needle) ||
        tags.includes(needle)
      );
    });
  }, [q, products]);

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
        {items.map((p) => (
          <Link key={p.id} to={`/products/${p.handle}`} className={styles.card}>
            <div className={styles.media}>
              {p.image ? (
                <img src={p.image} alt={p.title} />
              ) : (
                <div className={styles.placeholder} />
              )}
            </div>
            <div className={styles.meta}>
              <h4 className={styles.title}>{p.title}</h4>
              <p className={styles.price}>
                {p.price ? `${Number(p.price).toFixed(2)} ${p.currency || "GBP"}` : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
