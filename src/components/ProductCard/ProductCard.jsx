import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useShopifyCart } from "../../context/ShopifyCartContext";
import styles from "./ProductCard.module.scss";

/**
 * Try to find a variant matching current selections.
 * @param {Array} variants - array of variant nodes or flattened objects
 * @param {Object} selections - { size: 'M', color: 'Gold' } (lowercased keys)
 */
function resolveVariant(variants, selections) {
  if (!variants?.length) return null;
  const keys = Object.keys(selections || {});
  if (!keys.length) return null;
  return (
    variants.find((v) => {
      const opts = v.selectedOptions || v.node?.selectedOptions || [];
      return opts.every((o) => {
        const n = o.name?.toLowerCase?.().trim();
        const val = o.value?.toLowerCase?.().trim();
        const sel = selections[n];
        return sel && sel.toLowerCase().trim() === val;
      });
    }) || null
  );
}

/**
 * Product card with heart (favorites) and add-to-cart.
 * Favorites are saved by PRODUCT ID, no variant needed.
 */
export default function ProductCard({
  /** gid://shopify/Product/### */
  id,
  /** Shopify product handle (preferred for links & favorites) */
  handle,
  image,
  secondaryImage,
  title,
  price,
  options = [],
  variants = [],
  /** if true, force variant selection before add-to-cart */
  requireSelection = true,
}) {
  const { favorites = [], addToFavorites, removeFromFavorites, addToCart } = useShopifyCart();
  const navigate = useNavigate();
  const productId = id;
  const shortId = id?.split("/").pop();

  const [selections, setSelections] = useState({});

  const flatVariants = useMemo(
    () =>
      variants.map((v) => ({
        id: v.id || v.node?.id,
        availableForSale: v.availableForSale ?? v.node?.availableForSale,
        price: v.price || v.node?.price,
        selectedOptions: v.selectedOptions || v.node?.selectedOptions || [],
        title: v.title || v.node?.title,
      })),
    [variants]
  );

  const matchedVariant = useMemo(
    () =>
      resolveVariant(
        flatVariants,
        Object.fromEntries(
          Object.entries(selections).map(([k, v]) => [k.toLowerCase(), v])
        )
      ),
    [flatVariants, selections]
  );

  // Is this product already in favorites?
  const isFavorite = useMemo(
    () => favorites.some((f) => (f.productId || f.id) === productId),
    [favorites, productId]
  );

  /** Toggle favorite without requiring a variant. */
  function handleToggleFavorite(e) {
    e.preventDefault();
    e.stopPropagation(); // prevent wrapping <Link> navigation

    if (isFavorite) {
      removeFromFavorites(productId);
      toast("Removed from favorites");
    } else {
      addToFavorites({
        productId,
        id: productId,               // back-compat
        handle: handle || shortId,   // keep handle for deep-link
        image,
        title,
        price,
        currency: "GBP",
        quantity: 1,
      });
      toast.success("Saved to favorites");
    }
  }

  /** Add to cart (requires a specific variant). */
  async function handlePrimaryAction(e) {
    e.preventDefault();
    e.stopPropagation();

    const resolvedVariantId = matchedVariant?.id || null;
    const needsVariant =
      requireSelection && options.length > 0 && !resolvedVariantId;

    if (needsVariant) {
      toast.error("Please select options first");
      navigate(`/products/${handle || shortId}?select=1`);
      return;
    }
    if (!resolvedVariantId) {
      // If product truly has no options, navigate to PDP
      navigate(`/products/${handle || shortId}?select=1`);
      return;
    }
    if (matchedVariant && matchedVariant.availableForSale === false) {
      toast.error("This option is out of stock");
      return;
    }

    const res = await addToCart({ variantId: resolvedVariantId, quantity: 1 });
    if (res?.ok) toast.success("Added to cart");
    else if (res?.error === "VARIANT_REQUIRED") {
      toast.error("Please select options first");
      navigate(`/products/${handle || shortId}?select=1`);
    } else {
      toast.error("Couldn’t add to cart");
    }
  }

  function onSelectChange(name, value) {
    setSelections((prev) => ({ ...prev, [name.toLowerCase().trim()]: value }));
  }

  const resolvedVariantId = matchedVariant?.id || null;
  const needsVariant = requireSelection && options.length > 0 && !resolvedVariantId;
  const addAria = needsVariant ? "Select options" : "Add to Cart";

  return (
    <Link to={`/products/${handle || shortId}`} className={styles.productCard}>
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
            type="button"
            className={styles.iconButton}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
            aria-pressed={isFavorite}
            title={isFavorite ? "Remove favorite" : "Add favorite"}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>

          <button
            type="button"
            className={styles.iconButton}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handlePrimaryAction}
            aria-label={addAria}
            title={addAria}
            data-needs-variant={needsVariant ? "1" : "0"}
          >
            {needsVariant ? "Select" : <FaShoppingCart />}
          </button>
        </div>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.price}>£ {price}</p>

        {options?.length > 0 && (
          <div
            className={styles.optionsBar}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            {options.map((opt) => {
              const name = opt?.name || "";
              const values = opt?.values || [];
              return (
                <label key={name} className={styles.optionGroup}>
                  <span className={styles.optionLabel}>{name}</span>
                  <select
                    className={styles.optionSelect}
                    value={selections[name?.toLowerCase()?.trim()] || ""}
                    onChange={(e) => onSelectChange(name, e.target.value)}
                  >
                    <option value="">{`Select ${name}`}</option>
                    {values.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              );
            })}
            {matchedVariant && matchedVariant.price?.amount && (
              <div className={styles.variantPrice}>
                £ {Number(matchedVariant.price.amount).toFixed(2)}
                {!matchedVariant.availableForSale && (
                  <span className={styles.badge}>Sold out</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
