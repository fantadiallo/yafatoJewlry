import styles from './ProductCard.module.scss';
import { FaShoppingCart } from 'react-icons/fa';

export default function ProductCard({ image, title, price, oldPrice, discount }) {
  return (
    <div className={styles.productCard}>
      <div className={styles.imageWrapper}>
        {discount && <span className={styles.saleBadge}>Sale -{discount}%</span>}
        <img src={image} alt={title} className={styles.productImage} />
        <div className={styles.cartIcon}>
          <FaShoppingCart />
        </div>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.priceBox}>
        <span className={styles.price}>£{price}</span>
        {oldPrice && <span className={styles.oldPrice}>£{oldPrice}</span>}
      </div>
    </div>
  );
}
