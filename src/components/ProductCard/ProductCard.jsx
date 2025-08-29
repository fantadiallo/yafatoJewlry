import { Link } from 'react-router-dom';
import styles from './ProductCard.module.scss';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { useShopifyCart } from '../../context/ShopifyCartContext';

export default function ProductCard({ id, variantId, image, secondaryImage, title, price }) {
  const {
    addToCart,
    addToFavorites,
    removeFromFavorites,
    favorites = [],
  } = useShopifyCart();

  const shortId = id?.split('/').pop();
  const isFavorite = favorites.some((item) => item.variantId === variantId);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!variantId) return;
    addToCart({ id, variantId, title, image, price });
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    if (!variantId) return;
    isFavorite
      ? removeFromFavorites(variantId)
      : addToFavorites({ id, variantId, image, title, price });
  };

  return (
    <Link to={`/products/${shortId}`} className={styles.productCard}>
      <div className={styles.imageWrapper}>
        <img
          src={image}
          alt={title}
          className={`${styles.productImage} ${styles.defaultImage}`}
        />
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${title} alternate`}
            className={`${styles.productImage} ${styles.hoverImage}`}
          />
        )}

        <div className={styles.iconBar}>
          <button
            className={styles.iconButton}
            onClick={handleToggleFavorite}
            aria-label="Toggle Favorite"
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
          <button
            className={styles.iconButton}
            onClick={handleAddToCart}
            aria-label="Add to Cart"
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.price}>NOK {price}</p>
      </div>
    </Link>
  );
}
