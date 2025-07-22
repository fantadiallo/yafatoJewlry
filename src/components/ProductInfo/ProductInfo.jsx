import { useState, useEffect } from 'react';
import styles from './ProductInfo.module.scss';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function ProductInfo({ product }) {
  const {
    id,
    title,
    price,
    oldPrice,
    material,
    finish,
    sku,
  } = product;

  const [quantity, setQuantity] = useState(1);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFav(stored.includes(id));
  }, [id]);

  function toggleFavorite() {
    const stored = JSON.parse(localStorage.getItem('favorites')) || [];
    let updated;

    if (stored.includes(id)) {
      updated = stored.filter((favId) => favId !== id);
      setIsFav(false);
    } else {
      updated = [...stored, id];
      setIsFav(true);
    }

    localStorage.setItem('favorites', JSON.stringify(updated));
  }

  return (
    <div className={styles.info}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.favorite} onClick={toggleFavorite}>
          {isFav ? <FaHeart className={styles.filled} /> : <FaRegHeart />}
        </div>
      </div>

      <div className={styles.priceBox}>
        <span className={styles.price}>£{price}</span>
        {oldPrice && <span className={styles.oldPrice}>£{oldPrice}</span>}
      </div>

      <div className={styles.details}>
        <p><strong>Material:</strong> {material}</p>
        <p><strong>Finish:</strong> {finish}</p>
        <p><strong>SKU:</strong> {sku}</p>
      </div>

      <div className={styles.quantityRow}>
        <label htmlFor="qty">Quantity</label>
        <input
          type="number"
          id="qty"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
        />
      </div>

      <button className={styles.cartBtn}>Add to Cart</button>
      <button className={styles.shopPayBtn}>Buy with ShopPay</button>
    </div>
  );
}
