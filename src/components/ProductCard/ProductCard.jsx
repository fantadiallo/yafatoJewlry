import { Link } from 'react-router-dom';
import styles from './ProductCard.module.scss';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useShopifyCart } from '../../context/ShopifyCartContext';

export default function ProductCard({ id, variantId, image, title, price }) {
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
    if (!variantId) {
      console.warn('Missing variantId for cart');
      return;
    }

    addToCart({
      id,
      variantId,
      title,
      image: image || 'https://via.placeholder.com/400x400?text=No+Image',
      price: price || 0,
    });
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    if (!variantId) {
      console.warn('Missing variantId for favorite');
      return;
    }

    if (isFavorite) {
      removeFromFavorites(variantId);
    } else {
      addToFavorites({
        id,
        variantId,
        image,
        title,
        price,
      });
    }
  };

  return (
    <Link to={`/products/${shortId}`} className={styles.productLink}>
      <div className={styles.productCard}>
        <div className={styles.imageWrapper}>
          <img
            src={image || 'https://via.placeholder.com/400x400?text=No+Image'}
            alt={title}
            className={styles.productImage}
          />
          <div className={styles.iconBar}>
            <button
              className={styles.iconButton}
              onClick={handleToggleFavorite}
              aria-label="Toggle Favorite"
            >
              {isFavorite ? <FaHeart style={{ color: 'red' }} /> : <FaRegHeart />}
            </button>
          </div>
        </div>

        <h3 className={styles.title}>{title}</h3>
        <div className={styles.price}>£{price}</div>

        <button className={styles.addCartButton} onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
