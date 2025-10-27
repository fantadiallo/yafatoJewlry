import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ProductGallery.module.scss";

/**
 * @typedef {Object} GalleryImage
 * @property {string} url - Image source URL (absolute or relative)
 * @property {string} [alt] - Accessible description of the image
 */

/**
 * ProductGallery component
 *
 * Displays a responsive, accessible image gallery with:
 * - Keyboard navigation (← →, Enter, Space)
 * - Scrollable thumbnail strip on mobile
 * - Clickable thumbnails for switching images
 * - Click-to-open fullscreen zoom dialog (pan & zoom support)
 *
 * @component
 * @param {Object} props
 * @param {(string|GalleryImage)[]} [props.images=[]] - Array of image URLs or objects
 * @param {string} [props.title="Product"] - Product title for accessibility
 * @param {string} [props.focusUrl] - URL of image to focus initially
 * @returns {JSX.Element|null}
 */
export default function ProductGallery({ images = [], title = "Product", focusUrl }) {
  /** @type {GalleryImage[]} Normalize inputs */
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

  /** Keep index within range if image array changes */
  useEffect(() => {
    if (!normalized.length) return;
    if (index > normalized.length - 1) setIndex(0);
  }, [normalized.length, index]);

  /** Auto-scroll active thumbnail into view */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const active = rail.querySelector(`[data-i="${index}"]`);
    active?.scrollIntoView?.({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [index]);

  /** Focus a given image based on focusUrl prop */
  useEffect(() => {
    if (!focusUrl || !normalized.length) return;
    const i = normalized.findIndex((img) => img.url === focusUrl);
    if (i >= 0) setIndex(i);
  }, [focusUrl, normalized]);

  /** Navigate previous/next image */
  function prev() { setIndex((i) => (i - 1 + normalized.length) % normalized.length); }
  function next() { setIndex((i) => (i + 1) % normalized.length); }

  /** Keyboard navigation on thumbnails */
  function onThumbKey(e, i) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIndex(i); }
    else if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
  }

  /* ───── Lightbox (zoom) ───── */
  const dialogRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const dragRef = useRef({ dragging: false, sx: 0, sy: 0, ox: 0, oy: 0 });

  /** Open fullscreen lightbox */
  function openLightbox() { setZoom(1); setTx(0); setTy(0); dialogRef.current?.showModal(); }

  /** Close lightbox */
  function closeLightbox() { dialogRef.current?.close(); }

  /** Mouse wheel zoom control */
  function onWheel(e) {
    e.preventDefault();
    const delta = -Math.sign(e.deltaY) * 0.2;
    setZoom((z) => {
      const nz = Math.min(4, Math.max(1, +(z + delta).toFixed(2)));
      if (nz === 1) { setTx(0); setTy(0); }
      return nz;
    });
  }

  /** Start drag/pan on zoomed image */
  function onPointerDown(e) {
    if (zoom === 1) return;
    dragRef.current = { dragging: true, sx: e.clientX, sy: e.clientY, ox: tx, oy: ty };
  }

  /** Move image while dragging */
  function onPointerMove(e) {
    if (!dragRef.current.dragging) return;
    const { sx, sy, ox, oy } = dragRef.current;
    setTx(ox + (e.clientX - sx));
    setTy(oy + (e.clientY - sy));
  }

  /** End drag */
  function onPointerUp() { dragRef.current.dragging = false; }

  /** Reset pan/zoom when switching image */
  useEffect(() => { setTx(0); setTy(0); setZoom(1); }, [main?.url]);

  if (!normalized.length) return null;

  return (
    <section
      className={styles.gallery}
      aria-roledescription="product gallery"
      aria-label={`${title} gallery`}
    >
      {/* ───── Main image section ───── */}
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
            onClick={openLightbox}
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

      {/* ───── Thumbnail strip ───── */}
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

      {/* ───── Lightbox overlay ───── */}
      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        onClose={() => { setZoom(1); setTx(0); setTy(0); }}
      >
        <div
          className={styles.lbInner}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
        >
          <button className={styles.closeBtn} onClick={closeLightbox} aria-label="Close">×</button>
          <img
            src={main?.url}
            alt={main?.alt || title}
            className={`${styles.lbImg} ${zoom > 1 ? styles.lbZoomed : ""}`}
            style={{ ["--z"]: zoom, ["--tx"]: `${tx}px`, ["--ty"]: `${ty}px` }}
            draggable={false}
            onDoubleClick={() => setZoom((z) => (z === 1 ? 2 : 1))}
          />
        </div>
      </dialog>
    </section>
  );
}
