import { useEffect, useState } from "react";
import styles from "./ProductList.module.scss";
import ProductCard from "../ProductCard/ProductCard";

function getPriceInfo(p) {
  const v0 = p?.variants?.[0];
  const price = Number(v0?.price?.amount ?? p?.price ?? p?.priceRange?.minVariantPrice?.amount ?? 0);
  const compareAt = Number(
    v0?.compareAtPrice?.amount ??
      p?.compareAtPrice ??
      p?.compareAtPriceRange?.minVariantPrice?.amount ??
      0
  );
  return { price, compareAt };
}

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
    <section className={styles.wrap} aria-label="Product list">
      <div className={styles.grid} role="list">
        {products.map((p) => {
          const primaryImage = p.images?.[0]?.url || p.image || "/placeholder.png";
          const secondaryImage = p.images?.[1]?.url || p.secondaryImage || "";

          const { price, compareAt } = getPriceInfo(p);

          const buildVariantUrl = (variant) => {
            try {
              const base = p.handle ? `/products/${p.handle}` : `/products/${encodeURIComponent(p.id)}`;
              const u = new URL(base, window.location.origin);
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
              return p.handle ? `/products/${p.handle}` : `/products/${encodeURIComponent(p.id)}`;
            }
          };

          const productHref = p.handle ? `/products/${p.handle}` : `/products/${encodeURIComponent(p.id)}`;

          return (
            <div role="listitem" key={p.id} className={styles.item}>
              <article className={styles.card}>
                <ProductCard
                  id={p.id}
                  handle={p.handle}
                  image={primaryImage}
                  secondaryImage={secondaryImage}
                  title={p.title}
                  price={price}
                  compareAtPrice={compareAt || undefined}
                  options={p.options}
                  variants={p.variants}
                  requireSelection
                  productHref={productHref}
                  variantHrefBuilder={buildVariantUrl}
                />
              </article>
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
        ↑
      </button>
    </section>
  );
}
