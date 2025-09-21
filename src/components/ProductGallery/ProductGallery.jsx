import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ProductGallery.module.scss";

/**
 * @typedef {Object} GalleryImage
 * @property {string} url       Absolute or relative image URL
 * @property {string} [alt]     Accessible alt text
 */

/**
 * Normalize inputs and render a responsive product gallery:
 * - Mobile: horizontal, snap-scroll thumbnail rail
 * - Desktop: centered grid with larger main image
 * - Keyboard: ←/→ switches image, Enter/Space on thumb selects
 * - Accessibility: proper roles/labels; active state announced
 * @param {{ images?: (string|GalleryImage)[], title?: string }} props
 */
export default function ProductGallery({ images = [], title = "Product" }) {
  /** @type {GalleryImage[]} */
  const normalized = useMemo(
    () =>
      images
        .map((img, i) =>
          typeof img === "string" ? { url: img, alt: `${title} image ${i + 1}` } : img
        )
        .filter(Boolean),
    [images, title]
  );

  const [index, setIndex] = useState(0);
  const main = normalized[index];
  const railRef = useRef(null);

  useEffect(() => {
    if (!normalized.length) return;
    if (index > normalized.length - 1) setIndex(0);
  }, [normalized.length, index]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const active = rail.querySelector(`[data-i="${index}"]`);
    if (active?.scrollIntoView) {
      active.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    }
  }, [index]);

  function prev() {
    setIndex((i) => (i - 1 + normalized.length) % normalized.length);
  }
  function next() {
    setIndex((i) => (i + 1) % normalized.length);
  }

  function onThumbKey(e, i) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIndex(i);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  }

  if (!normalized.length) return null;

  return (
    <section
      className={styles.gallery}
      aria-roledescription="product gallery"
      aria-label={`${title} gallery`}
    >
      <div className={styles.mainWrap}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={prev}
          aria-label="Previous image"
          disabled={normalized.length <= 1}
        >
          ‹
        </button>

        <div className={styles.mainImage}>
          <img
            key={main?.url}
            src={main?.url}
            alt={main?.alt || title}
            loading="eager"
            sizes="(max-width: 640px) 92vw, 800px"
          />
        </div>

        <button
          type="button"
          className={styles.navBtn}
          onClick={next}
          aria-label="Next image"
          disabled={normalized.length <= 1}
        >
          ›
        </button>
      </div>

      {normalized.length > 1 && (
        <div
          className={styles.thumbnailRow}
          ref={railRef}
          role="tablist"
          aria-label="Gallery thumbnails"
        >
          {normalized.map((img, i) => {
            const active = i === index;
            return (
              <button
                key={img.url + i}
                type="button"
                data-i={i}
                className={`${styles.thumb} ${active ? styles.active : ""}`}
                role="tab"
                aria-selected={active}
                aria-label={`Show image ${i + 1} of ${normalized.length}`}
                onClick={() => setIndex(i)}
                onKeyDown={(e) => onThumbKey(e, i)}
              >
                <img
                  src={img.url}
                  alt={img.alt || `${title} ${i + 1}`}
                  loading="lazy"
                  sizes="(max-width: 640px) 22vw, 110px"
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
