import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ProductGallery.module.scss";

/**
 * @typedef {Object} GalleryImage
 * @property {string} url - Image source URL (absolute or relative).
 * @property {string} [alt] - Accessible description of the image.
 */

/**
 * ProductGallery
 *
 * Responsive, accessible product gallery:
 * - Main image fills the frame; subtle overlay prev/next arrows.
 * - Mobile: horizontally scrollable thumbnail rail; Desktop: wrapped row.
 * - Click main image → fullscreen lightbox (zoom: wheel/double-click, pan: drag).
 * - Swipe/flick in lightbox to change image; keyboard navigation on thumbs.
 *
 * @component
 * @param {Object} props
 * @param {(string|GalleryImage)[]} [props.images=[]] - Array of image URLs or {url,alt} objects.
 * @param {string} [props.title="Product"] - Used in alt text & aria labels.
 * @param {string} [props.focusUrl] - If provided, focuses the image with this URL on load.
 * @returns {JSX.Element|null}
 */
export default function ProductGallery({ images = [], title = "Product", focusUrl }) {
  /** Normalize inputs → [{url,alt}] */
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

  // Keep index in range if images change
  useEffect(() => {
    if (!normalized.length) return;
    if (index > normalized.length - 1) setIndex(0);
  }, [normalized.length, index]);

  // Scroll active thumb into view
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const active = rail.querySelector(`[data-i="${index}"]`);
    active?.scrollIntoView?.({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [index]);

  // Focus a given image based on focusUrl
  useEffect(() => {
    if (!focusUrl || !normalized.length) return;
    const i = normalized.findIndex((img) => img.url === focusUrl);
    if (i >= 0) setIndex(i);
  }, [focusUrl, normalized]);

  /** Go to previous image */
  function prev() {
    setIndex((i) => (i - 1 + normalized.length) % normalized.length);
  }

  /** Go to next image */
  function next() {
    setIndex((i) => (i + 1) % normalized.length);
  }

  /** Keyboard behavior on thumbnails */
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

  /* ───── Lightbox (zoom + pan + swipe) ───── */
  const dialogRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const dragRef = useRef({ dragging: false, sx: 0, sy: 0, ox: 0, oy: 0, t0: 0 });

  /** Open fullscreen lightbox */
  function openLightbox() {
    setZoom(1);
    setTx(0);
    setTy(0);
    dialogRef.current?.showModal();
  }

  /** Close lightbox */
  function closeLightbox() {
    dialogRef.current?.close();
  }

  /** Mouse wheel zoom */
  function onWheel(e) {
    e.preventDefault();
    const delta = -Math.sign(e.deltaY) * 0.2;
    setZoom((z) => {
      const nz = Math.min(4, Math.max(1, +(z + delta).toFixed(2)));
      if (nz === 1) {
        setTx(0);
        setTy(0);
      }
      return nz;
    });
  }

  /** Start pan / prepare swipe */
  function onPointerDown(e) {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = {
      dragging: true,
      sx: e.clientX,
      sy: e.clientY,
      ox: tx,
      oy: ty,
      t0: performance.now(),
    };
  }

  /** Pan while dragging (when zoomed) */
  function onPointerMove(e) {
    if (!dragRef.current.dragging) return;
    const { sx, sy, ox, oy } = dragRef.current;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    if (zoom > 1) {
      setTx(ox + dx);
      setTy(oy + dy);
    }
  }

  /** End drag; detect swipe to change image */
  function onPointerUp(e) {
    if (!dragRef.current.dragging) return;
    const { sx, sy, t0, ox, oy } = dragRef.current;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    const dt = Math.max(1, performance.now() - t0);

    dragRef.current.dragging = false;

    const speedX = Math.abs(dx) / dt; // px/ms
    const isHorizontal = Math.abs(dx) > Math.abs(dy) * 1.2;
    const passed = Math.abs(dx) > 120 || speedX > 0.6;

    if (isHorizontal && passed) {
      if (dx < 0) next();
      else prev();
      setTx(0);
      setTy(0);
      return;
    }

    if (zoom > 1) {
      setTx(ox + dx);
      setTy(oy + dy);
    }
  }

  // Reset pan/zoom when switching image
  useEffect(() => {
    setTx(0);
    setTy(0);
    setZoom(1);
  }, [main?.url]);

  if (!normalized.length) return null;

  return (
    <section
      className={styles.gallery}
      aria-roledescription="product gallery"
      aria-label={`${title} gallery`}
    >
      {/* ───── Main image with overlay, subtle arrows ───── */}
      <div className={styles.mainWrap}>
        <div className={styles.mainImage}>
          <button
            type="button"
            className={`${styles.mainArrow} ${styles.mainPrev}`}
            aria-label="Previous image"
            onClick={prev}
            disabled={normalized.length <= 1}
            title="Previous image"
          >
            ‹
          </button>

          <img
            key={main?.url}
            src={main?.url}
            alt={main?.alt || title}
            loading="eager"
            sizes="(max-width: 640px) 100vw, 900px"
            onClick={openLightbox}
          />

          <button
            type="button"
            className={`${styles.mainArrow} ${styles.mainNext}`}
            aria-label="Next image"
            onClick={next}
            disabled={normalized.length <= 1}
            title="Next image"
          >
            ›
          </button>
        </div>
      </div>

      {/* ───── Thumbnails ───── */}
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
                title={`Preview ${title} image ${i + 1}`}
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
        onClose={() => {
          setZoom(1);
          setTx(0);
          setTy(0);
        }}
      >
        <div
          className={styles.lbInner}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <button
            className={styles.closeBtn}
            onClick={closeLightbox}
            aria-label="Close"
            title="Close"
          >
            ×
          </button>

          <button
            type="button"
            className={`${styles.lbArrow} ${styles.lbPrev}`}
            aria-label="Previous image"
            onClick={() => {
              prev();
              setTx(0);
              setTy(0);
            }}
            data-disabled={normalized.length <= 1 ? "true" : "false"}
            title="Previous"
          >
            ‹
          </button>

          <img
            src={main?.url}
            alt={main?.alt || title}
            className={`${styles.lbImg} ${zoom > 1 ? styles.lbZoomed : ""}`}
            style={{ ["--z"]: zoom, ["--tx"]: `${tx}px`, ["--ty"]: `${ty}px` }}
            draggable={false}
            onDoubleClick={() => setZoom((z) => (z === 1 ? 2 : 1))}
          />

          <button
            type="button"
            className={`${styles.lbArrow} ${styles.lbNext}`}
            aria-label="Next image"
            onClick={() => {
              next();
              setTx(0);
              setTy(0);
            }}
            data-disabled={normalized.length <= 1 ? "true" : "false"}
            title="Next"
          >
            ›
          </button>
        </div>
      </dialog>
    </section>
  );
}

