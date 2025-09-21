import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductRecommendations.module.scss";
import {
  fetchRecommendationsById,
  fetchRecommendationsByHandle,
} from "../../api/shopify";

function formatMoneyGBP(amount) {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (!Number.isFinite(n)) return "";
  try {
    return new Intl.NumberFormat("en-NO", { style: "currency", currency: "NOK" }).format(n);
  } catch {
    return `kr${(n || 0).toFixed(2)}`;
  }
}

export default function ProductRecommendations({ products, productId, handle, currentId }) {
  const [list, setList] = useState(products || []);
  const [loading, setLoading] = useState(!products?.length);
  const railRef = useRef(null);

  useEffect(() => {
    if (products?.length) return;
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        let data = [];
        if (productId) data = await fetchRecommendationsById(productId);
        else if (handle) data = await fetchRecommendationsByHandle(handle);
        if (!alive) return;
        setList(Array.isArray(data) ? data : []);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [products, productId, handle]);

  const items = useMemo(() => {
    const seen = new Set();
    return (list || [])
      .filter(p => (currentId ? p.id !== currentId : true))
      .filter(p => {
        const key = p.id || p.handle || `${p.title}-${p.image}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 12);
  }, [list, currentId]);

  const scrollByCards = useCallback((dir = 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector(`.${styles.cardWrap}`);
    const w = card ? card.getBoundingClientRect().width : 280;
    rail.scrollBy({ left: dir * (w + 16), behavior: "smooth" });
  }, []);

  if (loading) {
    return (
      <section className={styles.recommendations} aria-label="Product recommendations">
        <h2 className={styles.heading}>You may also like</h2>
        <div className={styles.grid} data-layout="grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section className={styles.recommendations} aria-label="Product recommendations">
      <h2 className={styles.heading}>You may also like</h2>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navBtn}
          aria-label="Previous"
          onClick={() => scrollByCards(-1)}
        >
          ‹
        </button>
        <button
          type="button"
          className={styles.navBtn}
          aria-label="Next"
          onClick={() => scrollByCards(1)}
        >
          ›
        </button>
      </div>

      <div
        className={styles.rail}
        ref={railRef}
        role="group"
        aria-roledescription="carousel"
      >
        {items.map((p) => (
          <div key={p.id || p.handle} className={styles.cardWrap}>
            <ProductCard
              id={p.id}
              image={p.image}
              title={p.title}
              price={formatMoneyGBP(p.price)}
              oldPrice={p.oldPrice ? formatMoneyGBP(p.oldPrice) : undefined}
              discount={p.discount}
            />
          </div>
        ))}
      </div>

      <div className={styles.grid} data-layout="grid">
        {items.map((p) => (
          <div key={(p.id || p.handle) + "-grid"} className={styles.cardWrap}>
            <ProductCard
              id={p.id}
              image={p.image}
              title={p.title}
              price={formatMoneyGBP(p.price)}
              oldPrice={p.oldPrice ? formatMoneyGBP(p.oldPrice) : undefined}
              discount={p.discount}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
