import { useEffect, useMemo, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductRecommendations.module.scss";
import {
  fetchRecommendationsById,
  fetchRecommendationsByHandle,
} from "../../api/shopify";

function formatMoneyGBP(amount) {
  if (!amount) return "";
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
}

export default function ProductRecommendations({ products, productId, handle, currentId }) {
  const [list, setList] = useState(products || []);
  const [loading, setLoading] = useState(!products?.length);

  useEffect(() => {
    if (products?.length) return;
    let alive = true;
    async function load() {
      setLoading(true);
      try {
        let data = [];
        if (productId) data = await fetchRecommendationsById(productId);
        else if (handle) data = await fetchRecommendationsByHandle(handle);
        if (!alive) return;
        setList(data);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
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
      .slice(0, 8);
  }, [list, currentId]);

  if (loading) {
    return (
      <section className={styles.recommendations}>
        <h2 className={styles.heading}>You may also like</h2>
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section className={styles.recommendations}>
      <h2 className={styles.heading}>You may also like</h2>
      <div className={styles.grid}>
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
    </section>
  );
}
