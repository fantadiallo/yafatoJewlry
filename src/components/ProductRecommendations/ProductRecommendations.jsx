import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductRecommendations.module.scss";
import {
  fetchRecommendationsById,
  fetchRecommendationsByHandle,
} from "../../api/shopify";

/**
 * Format a number as a currency string in NOK.
 *
 * @param {number|string} amount - The amount to format.
 * @returns {string} Formatted currency string, e.g. "kr100.00".
 */
function formatMoneyGBP(amount) {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (!Number.isFinite(n)) return "";
  try {
    return new Intl.NumberFormat("en-NO", { style: "currency", currency: "NOK" }).format(n);
  } catch {
    return `kr${(n || 0).toFixed(2)}`;
  }
}

/**
 * ProductRecommendations Component
 *
 * Displays a list of recommended products for a given product page.
 * - Fetches recommendations either by product ID or handle.
 * - Supports initial recommendations passed as props.
 * - Deduplicates results and filters out the current product.
 * - Renders recommendations in both a horizontal carousel and a fallback grid layout.
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} [props.products] - Pre-fetched recommended products (optional).
 * @param {string} [props.productId] - Shopify product ID used to fetch recommendations.
 * @param {string} [props.handle] - Shopify product handle used to fetch recommendations.
 * @param {string} [props.currentId] - Current product ID to exclude from recommendations.
 * @returns {JSX.Element|null} Rendered product recommendations section or null if none.
 */
export default function ProductRecommendations({ products, productId, handle, currentId }) {
  const [list, setList] = useState(products || []);
  const [loading, setLoading] = useState(!products?.length);
  const railRef = useRef(null);

  // Fetch recommendations if not already provided
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

  /**
   * Compute final items list:
   * - Deduplicated by id/handle/title-image combo
   * - Excludes current product
   * - Limited to 12 items
   */
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

  /**
   * Scroll horizontally by one product card.
   *
   * @param {number} [dir=1] - Direction multiplier: -1 for left, +1 for right.
   */
  const scrollByCards = useCallback((dir = 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector(`.${styles.cardWrap}`);
    const w = card ? card.getBoundingClientRect().width : 280;
    rail.scrollBy({ left: dir * (w + 16), behavior: "smooth" });
  }, []);

  // Skeleton loading state
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

      {/* Carousel navigation controls */}
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

      {/* Horizontal carousel rail */}
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

      {/* Grid fallback (mobile/alternative layout) */}
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
