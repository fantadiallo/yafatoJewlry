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
 * - Under 600px: exactly 2 cards/row
 * - ≥992px: 3 cards/row
 * Includes an accessible floating “Back to top” button.
 * Additionally: exposes a variant URL builder so cards can
 * deep-link to a selected variant (and focused image).
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
    onScroll();
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

        const buildVariantUrl = (variant) => {
            try {
              const u = new URL(`/products/${encodeURIComponent(p.id)}`, window.location.origin);

              if (variant?.id) u.searchParams.set("variant", variant.id);

             if (Array.isArray(variant?.selectedOptions)) {
                for (const o of variant.selectedOptions) {
                  const k = String(o?.name || "").toLowerCase();
                  const v = String(o?.value || "");
                  if (k && v) u.searchParams.set(k, v);
                }
              }

             const vImg = variant?.image?.url || "";
              if (vImg) u.searchParams.set("focus", vImg);

              return u.pathname + u.search;
            } catch {
             return `/products/${encodeURIComponent(p.id)}`;
            }
          };

        const productHref = `/products/${encodeURIComponent(p.id)}`;

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
               productHref={productHref}
                variantHrefBuilder={buildVariantUrl}
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
