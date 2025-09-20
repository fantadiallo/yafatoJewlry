import { useState } from "react";
import styles from "./ProductGallery.module.scss";

export default function ProductGallery({ images = [], title = "Product" }) {

  const normalized = images.map((img, i) =>
    typeof img === "string" ? { url: img, alt: `${title} image ${i + 1}` } : img
  );

  const [main, setMain] = useState(normalized[0]);

  if (!normalized.length) return null;

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImage}>
        <img src={main.url} alt={main.alt || title} />
      </div>

      {normalized.length > 1 && (
        <div className={styles.thumbnailRow}>
          {normalized.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setMain(img)}
              className={`${styles.thumb} ${main.url === img.url ? styles.active : ""}`}
            >
              <img src={img.url} alt={img.alt || `${title} ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
