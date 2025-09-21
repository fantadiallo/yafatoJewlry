import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./Collection.module.scss";
import { fetchShopifyProducts } from "../../api/shopify";

const AUTO_ROTATE_MS = 3500;

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} title
 * @property {string} [image]
 * @property {string} [secondaryImage]
 * @property {number|string} [price]
 * @property {string} [variantId]
 */

/**
 * Latest Collection section with a left hero and a right rotating product spotlight.
 * - Autoplay pauses on hover/focus/off-screen and respects prefers-reduced-motion
 * - Keyboard friendly (←/→ and focusable dots)
 */
export default function Collection() {
  /** @type {[Product[], Function]} */
  const [products, setProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Refs for timers and intersection tracking
  const timeoutRef = useRef(/** @type {number|ReturnType<typeof setTimeout>|null} */(null));
  const rootRef = useRef(/** @type {HTMLElement|null} */(null));
  const inViewRef = useRef(true);
  const reduceMotionRef = useRef(false);

  // Fetch Shopify products
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchShopifyProducts();
        if (!alive) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Limit slides to 5 and guard nulls
  const slides = useMemo(() => (products || []).filter(Boolean).slice(0, 5), [products]);
  const slideCount = slides.length;

  // Respect prefers-reduced-motion
  useEffect(() => {
    reduceMotionRef.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  }, []);

  // Preload next image to keep transitions snappy
  useEffect(() => {
    if (slideCount < 2) return;
    const next = slides[(activeIndex + 1) % slideCount];
    if (next?.image) {
      const img = new Image();
      img.src = next.image;
    }
  }, [activeIndex, slides, slideCount]);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const schedule = useCallback(() => {
    clearTimer();
    if (reduceMotionRef.current || !inViewRef.current || slideCount < 2) return;
    timeoutRef.current = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % slideCount);
    }, AUTO_ROTATE_MS);
  }, [clearTimer, slideCount]);

  useEffect(() => {
    schedule();
    return clearTimer;
  }, [activeIndex, schedule, clearTimer]);

  // Pause when off-screen to save battery/CPU
  useEffect(() => {
    if (!rootRef.current || typeof IntersectionObserver === "undefined") return;
    const el = rootRef.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        if (!inViewRef.current) clearTimer();
        else schedule();
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [schedule, clearTimer]);

  const prev = useCallback(() => {
    clearTimer();
    setActiveIndex((i) => (i - 1 + slideCount) % slideCount);
  }, [clearTimer, slideCount]);

  const next = useCallback(() => {
    clearTimer();
    setActiveIndex((i) => (i + 1) % slideCount);
  }, [clearTimer, slideCount]);

  const pause = useCallback(() => clearTimer(), [clearTimer]);
  const resume = useCallback(() => schedule(), [schedule]);

  const onKeyDown = useCallback(
    /** @param {React.KeyboardEvent} e */
    (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    },
    [prev, next]
  );

  return (
    <section ref={rootRef} className={styles.sectionCollection} aria-label="Latest Collection">
      {/* Header */}
      <div className={styles.sectionHeader}>
        <h2>Latest Collection</h2>
        <a href="/products" className={styles.viewAll}>View All →</a>
        <hr aria-hidden="true" />
      </div>

      {/* Hero grid */}
      <div className={styles.collectionHeroNew}>
        {/* Left hero */}
        <div className={styles.heroLeft}>
          <img
            src="/fato2.jpg"
            alt="Gen-Z jewelry lifestyle"
            loading="eager"
            decoding="async"
          />
          <div className={styles.heroText}>
            <h2>Latest Collection</h2>
            <p>
              <strong>Gen-Z</strong> crafted for a generation doing the inner work, while expressing!
            </p>
            <a href="/products" className={styles.cta}>Shop Collection →</a>
          </div>
        </div>

        {/* Right rotating product spotlight */}
        <div
          className={styles.heroRight}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocus={pause}
          onBlur={resume}
          onKeyDown={onKeyDown}
          role="region"
          aria-roledescription="carousel"
          aria-label="Product spotlight"
        >
          {slideCount > 0 && (
            <div className={styles.productShowcase}>
              {/* Prev/Next */}
              <button
                type="button"
                className={`${styles.navBtn} ${styles.prev}`}
                onClick={prev}
                aria-label="Previous product"
                disabled={slideCount <= 1}
              >
                ‹
              </button>

              <div className={styles.productCard} aria-live="polite">
                <ProductCard
                  id={slides[activeIndex].id}
                  variantId={slides[activeIndex].variantId}
                  image={slides[activeIndex].image}
                  secondaryImage={slides[activeIndex].secondaryImage}
                  title={slides[activeIndex].title}
                  price={slides[activeIndex].price}
                />
                <div className={styles.overlay}>
                  <a href="/products">Go to Collection →</a>
                </div>
              </div>

              <button
                type="button"
                className={`${styles.navBtn} ${styles.next}`}
                onClick={next}
                aria-label="Next product"
                disabled={slideCount <= 1}
              >
                ›
              </button>

              {/* Dots */}
              <div className={styles.dots} role="tablist" aria-label="Slide selector">
                {slides.map((slide, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={slide.id ?? idx}
                      type="button"
                      className={`${styles.dot} ${active ? styles.activeDot : ""}`}
                      role="tab"
                      aria-selected={active}
                      aria-label={`Show item ${idx + 1} of ${slideCount}`}
                      onClick={() => {
                        clearTimer();
                        setActiveIndex(idx);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
