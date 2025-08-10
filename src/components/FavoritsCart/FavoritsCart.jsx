import styles from './FavoritesCart.module.scss';
import { FiHeart, FiShoppingBag, FiX, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useShopifyCart } from '../../context/ShopifyCartContext';

export default function FavoritesCart({ isOpen, onClose }) {
  const {
    favorites,
    removeFromFavorites,
    moveToCartFromFavorites,
  } = useShopifyCart();

  function handleMoveToCart(item) {
    if (!item.variantId) {
      console.warn('Missing variantId in favorite item');
      return;
    }

    moveToCartFromFavorites(item); // ✅ Send full item object
  }

  return (
    <div className={`${styles.favoritesCart} ${isOpen ? styles.open : ''}`}>
      <div className={styles.topBar}>
        <h3>Your Favorites</h3>
        <button onClick={onClose} className={styles.closeBtn}>
          <FiX />
        </button>
      </div>

      <div className={styles.items}>
        {(favorites?.length ?? 0) === 0 ? (
          <p>No favorites yet</p>
        ) : (
          favorites.map((item) => (
            <div key={item.variantId} className={styles.favoriteItem}>
              <Link to={`/products/${item.id}`} onClick={onClose}>
                <img
                  src={item.image || 'https://via.placeholder.com/400x400?text=No+Image'}
                  alt={item.title}
                />
              </Link>

              <div className={styles.details}>
                <Link to={`/products/${item.id}`} onClick={onClose}>
                  <h4>{item.title}</h4>
                </Link>
                <p>{item.price} kr</p>

                <div className={styles.buttons}>
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className={styles.addBtn}
                  >
                    <FiShoppingBag /> Move to Cart
                  </button>
                  <button
                    onClick={() => removeFromFavorites(item.variantId)}
                    className={styles.removeBtn}
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
