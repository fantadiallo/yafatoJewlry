import { useEffect, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductList.module.scss";

/**
 * @typedef {{ url: string }} ProductImage
 * @typedef {{
 *   id: string,
 *   title: string,
 *   price: number|string,
 *   images?: ProductImage[],
 *   options?: any[],
 *   variants?: any[]
 * }} Product
 */

/**
 * Responsive product grid:
 * - Under 600px: exactly 2 cards/row (requested)
 * - ≥992px: 3 cards/row (kept like your current desktop)
 * Includes an accessible floating “Back to top” button.
 * @param {{ products?: Product[] }} props
 */
export default function ProductList({ products = [] }) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setShowTop(window.scrollY > 400);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // init
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduce ? "auto" : "smooth" });
  };

  if (!products.length) return null;

  return (
    <section aria-label="Product list">
      <div className={styles.grid} role="list">
        {products.map((p) => {
          const primaryImage = p.images?.[0]?.url || "/placeholder.png";
          const secondaryImage = p.images?.[1]?.url || "/placeholder.png";

          return (
            <div role="listitem" key={p.id} className={styles.item}>
              <ProductCard
                id={p.id}
                image={primaryImage}
                secondaryImage={secondaryImage}
                title={p.title}
                price={p.price}
                options={p.options}
                variants={p.variants}
                requireSelection
                loading="lazy"
                sizes="(min-width: 992px) 33vw, 50vw"
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className={`${styles.toTop} ${showTop ? styles.visible : ""}`}
        aria-label="Back to top"
        title="Back to top"
        onClick={scrollToTop}
      >
        ↑ Top
      </button>
    </section>
  );
}
