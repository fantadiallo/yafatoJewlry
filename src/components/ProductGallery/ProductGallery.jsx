import { useState } from 'react';
import styles from './ProductGallery.module.scss';

export default function ProductGallery({ images = [], title = 'Product' }) {
  const [mainImage, setMainImage] = useState(images[0]);

  if (!images.length) return null;

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImage}>
        <img src={mainImage} alt={title} />
      </div>
      <div className={styles.thumbnailRow}>
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`${title} view ${index + 1}`}
            onClick={() => setMainImage(img)}
            className={mainImage === img ? styles.active : ''}
          />
        ))}
      </div>
    </div>
  );
}
