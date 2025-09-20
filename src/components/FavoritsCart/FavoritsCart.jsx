import styles from "./FavoritesCart.module.scss";
import { FiShoppingBag, FiX, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useShopifyCart } from "../../context/ShopifyCartContext";
import { fetchProductByHandle, fetchSingleProductById } from "../../api/shopify";

/** Format money helper */
function formatMoney(amount, currency = "GBP") {
  const n = Number(amount || 0);
  try { return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(n); }
  catch { return `${n.toFixed(2)} ${currency}`; }
}

/** Extract numeric product id from a Shopify GID */
function productIdFromGID(id) {
  if (!id) return null;
  const m = String(id).match(/Product\/(\d+)/);
  return m ? m[1] : null;
}

/** Best-effort product link */
function productPath(item) {
  if (item?.handle) return `/products/${item.handle}`;
  const numeric = productIdFromGID(item?.productId || item?.id);
  if (numeric) return `/products/${numeric}`;
  if (item?.productId || item?.id) return `/products/${encodeURIComponent(item.productId || item.id)}`;
  return `/products`;
}

/** Pick a display image */
function favoriteImage(item) {
  const candidates = [
    item?.image,
    item?.featuredImage?.url,
    Array.isArray(item?.images) ? item.images[0] : null,
    item?.images?.edges?.[0]?.node?.url,
  ].filter(Boolean);
  let first = candidates[0];
  if (first && typeof first === "object" && "url" in first) first = first.url;
  return typeof first === "string" ? first : "";
}

const PLACEHOLDER = "https://via.placeholder.com/600x600?text=No+Image";

export default function FavoritesCart({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { favorites = [], removeFromFavorites, moveToCartFromFavorites } = useShopifyCart();
  const [busy, setBusy] = useState({});
  const currency = favorites?.[0]?.currency || "GBP";

  /**
   * Find a usable variantId for a favorite item.
   * 1) existing variantId
   * 2) local variants on the item
   * 3) fetch by handle
   * 4) fetch by product id (GID or numeric)
   */
  async function resolveVariantId(item) {
    // 1) already set?
    if (item?.variantId) return item.variantId;

    // 2) local variants
    const localVariants =
      Array.isArray(item?.variants)
        ? item.variants
        : item?.variants?.edges?.map((e) => e.node) || [];
    const localPick =
      localVariants.find((v) => (v?.available ?? v?.availableForSale) && v?.id) ||
      localVariants[0];
    if (localPick?.id) return localPick.id;

    // 3) by handle
    if (item?.handle) {
      try {
        const p = await fetchProductByHandle(item.handle);
        const vs = Array.isArray(p?.variants) ? p.variants : [];
        const pick =
          vs.find((v) => (v?.available ?? v?.availableForSale) && v?.id) || vs[0];
        if (pick?.id) return pick.id;
      } catch { /* ignore */ }
    }

    // 4) by product id (gid or numeric)
    const pid = item?.productId || item?.id;
    if (pid) {
      try {
        const p = await fetchSingleProductById(pid);
        const vs = Array.isArray(p?.variants) ? p.variants : [];
        const pick =
          vs.find((v) => (v?.available ?? v?.availableForSale) && v?.id) || vs[0];
        if (pick?.id) return pick.id;
      } catch { /* ignore */ }
    }

    // no luck
    return null;
  }

  async function handleMoveToCart(item) {
    const vId = await resolveVariantId(item);

    // If still no variant, send user to PDP to select
    if (!vId) {
      const to = `${productPath(item)}?select=1`;
      onClose?.();
      navigate(to);
      return;
    }

    if (busy[vId]) return;
    setBusy((b) => ({ ...b, [vId]: true }));

    try {
      const res = await moveToCartFromFavorites({
        ...item,
        variantId: vId,
        quantity: item.quantity || 1,
      });
      if (!res?.ok) {
        // Fallback: open PDP if Shopify rejected the variant
        const to = `${productPath(item)}?select=1`;
        navigate(to);
      }
    } finally {
      setBusy((b) => {
        const copy = { ...b };
        delete copy[vId];
        return copy;
      });
    }
  }

  function handleRemove(item) {
    // Remove by product id first; fallback to variant id
    const key = item?.productId || item?.id || item?.variantId;
    if (!key) return;
    removeFromFavorites(key);
  }

  return (
    <div
      className={`${styles.favoritesCart} ${isOpen ? styles.open : ""}`}
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
            const key = item?.productId || item?.id || item?.variantId || to;
            const vKey = item?.variantId;

            return (
              <div key={key} className={styles.favoriteItem}>
                <Link to={to} onClick={onClose} className={styles.mediaLink} aria-label={`View ${item.title || "product"}`}>
                  <img
                    src={img}
                    alt={item.title || "Product image"}
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
                      disabled={!!(vKey && busy[vKey])}
                      aria-disabled={!!(vKey && busy[vKey])}
                    >
                      <FiShoppingBag />
                      {vKey && busy[vKey] ? "Moving…" : "Move to Cart"}
                    </button>

                    <button
                      onClick={() => handleRemove(item)}
                      className={styles.removeBtn}
                      aria-label={`Remove ${item.title || "product"} from favorites`}
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
