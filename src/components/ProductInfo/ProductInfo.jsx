import styles from './ProductInfo.module.scss';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useShopifyCart } from '../../context/ShopifyCartContext';
import { useState } from 'react';

export default function ProductInfo({ product }) {
  const {
    addToCart,
    addToFavorites,
    removeFromFavorites,
    favorites = [],
  } = useShopifyCart();

  const {
    id,
    variantId,
    title,
    description,
    price,
    oldPrice,
    material,
    finish,
    sku,
    image,
  } = product;

  const [quantity, setQuantity] = useState(1);
  const isFav = favorites.some((item) => item.variantId === variantId);

  function handleToggleFavorite() {
    if (isFav) {
      removeFromFavorites(variantId);
    } else {
      addToFavorites(product);
    }
  }

  function handleAddToCart() {
    addToCart(product);
  }

  return (
    <div className={styles.info}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.favorite} onClick={handleToggleFavorite}>
          {isFav ? <FaHeart className={styles.filled} /> : <FaRegHeart />}
        </div>
      </div>

      {description && <p className={styles.description}>{description}</p>}

      <div className={styles.priceBox}>
        <span className={styles.price}>£{price}</span>
        {oldPrice && <span className={styles.oldPrice}>£{oldPrice}</span>}
      </div>

      <div className={styles.details}>
        {material && <p><strong>Material:</strong> {material}</p>}
        {finish && <p><strong>Finish:</strong> {finish}</p>}
        {sku && <p><strong>SKU:</strong> {sku}</p>}
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

      <button className={styles.cartBtn} onClick={handleAddToCart}>Add to Cart</button>
   </div>
  );
}
