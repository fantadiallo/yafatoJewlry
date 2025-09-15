import styles from './FavoritesCart.module.scss';
import { FiShoppingBag, FiX, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useShopifyCart } from '../../context/ShopifyCartContext';

function formatMoney(amount, currency = "GBP") {
  const n = Number(amount || 0);
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currency}`;
  }
}

// Extract a numeric product id from a Shopify GID if possible
function productIdFromGID(id) {
  if (!id) return null;
  const m = String(id).match(/Product\/(\d+)/);
  return m ? m[1] : null;
}

// Build a canonical product path from favorite payload
function productPath(item) {
  if (item?.handle) return `/products/${item.handle}`;
  const numeric = productIdFromGID(item?.id);
  if (numeric) return `/products/${numeric}`;
  if (item?.id) return `/products/${encodeURIComponent(item.id)}`;
  return `/products`;
}

// Pick the best image URL available
function favoriteImage(item) {
  const candidates = [
    item?.image,
    item?.featuredImage?.url,
    Array.isArray(item?.images) ? item.images[0] : null,
    item?.images?.edges?.[0]?.node?.url,
  ].filter(Boolean);

  let first = candidates[0];
  if (first && typeof first === 'object' && 'url' in first) first = first.url;
  return typeof first === 'string' ? first : '';
}

const PLACEHOLDER = 'https://via.placeholder.com/600x600?text=No+Image';

export default function FavoritesCart({ isOpen, onClose }) {
  const { favorites = [], removeFromFavorites, moveToCartFromFavorites } = useShopifyCart();

  // prevent double actions per-item
  const [busy, setBusy] = useState({}); // { [variantId]: true }

  function handleMoveToCart(item) {
    const vId = item?.variantId;
    if (!vId) {
      console.warn('Missing variantId in favorite item', item);
      return;
    }
    if (busy[vId]) return;

    setBusy((b) => ({ ...b, [vId]: true }));
    try {
      // Pass the whole product; context will add to cart and remove from favorites
      moveToCartFromFavorites({ ...item, quantity: item.quantity || 1 });
    } finally {
      setBusy((b) => {
        const clone = { ...b };
        delete clone[vId];
        return clone;
      });
    }
  }

  function handleRemove(item) {
    const vId = item?.variantId;
    if (!vId) return;
    removeFromFavorites(vId);
  }

  const currency = favorites?.[0]?.currency || "GBP";

  return (
    <div
      className={`${styles.favoritesCart} ${isOpen ? styles.open : ''}`}
      role="dialog"
      aria-label="Favorites"
      aria-modal="true"
    >
      <div className={styles.topBar}>
        <h3>Your Favorites</h3>
        <button onClick={onClose} className={styles.closeBtn} aria-label="Close favorites">
          <FiX />
        </button>
      </div>

      <div className={styles.items}>
        {favorites.length === 0 ? (
          <p className={styles.empty}>No favorites yet</p>
        ) : (
          favorites.map((item) => {
            const to = productPath(item);
            const img = favoriteImage(item) || PLACEHOLDER;
            const vId = item.variantId;

            return (
              <div key={vId || item.id} className={styles.favoriteItem}>
                <Link
                  to={to}
                  onClick={onClose}
                  className={styles.mediaLink}
                  aria-label={`View ${item.title || 'product'}`}
                >
                  <img
                    src={img}
                    alt={item.title || 'Product image'}
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
                    loading="lazy"
                  />
                </Link>

                <div className={styles.details}>
                  <Link to={to} onClick={onClose} className={styles.titleLink}>
                    <h4 className={styles.title}>{item.title || "Untitled"}</h4>
                  </Link>

                  <p className={styles.price}>
                    {formatMoney(item.price, item.currency || currency)}
                  </p>

                  <div className={styles.buttons}>
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className={styles.addBtn}
                      disabled={!vId || busy[vId]}
                      aria-disabled={!vId || busy[vId]}
                    >
                      <FiShoppingBag />
                      {busy[vId] ? 'Moving…' : 'Move to Cart'}
                    </button>

                    <button
                      onClick={() => handleRemove(item)}
                      className={styles.removeBtn}
                      aria-label={`Remove ${item.title || 'product'} from favorites`}
                    >
                      <FiTrash2 /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
