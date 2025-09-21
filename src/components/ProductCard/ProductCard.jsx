import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useShopifyCart } from "../../context/ShopifyCartContext";
import styles from "./ProductCard.module.scss";

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
 * ProductCard
 * @param {{
 *   id: string,                    // gid://shopify/Product/123...
 *   handle?: string,              // product handle (slug)
 *   image?: string,
 *   secondaryImage?: string,
 *   title: string,
 *   price?: number|string,
 *   options?: Array,
 *   variants?: Array,
 *   requireSelection?: boolean
 * }} props
 */
export default function ProductCard({
  id,
  handle,                 // 🔹 make sure the parent passes this (p.handle)
  image,
  secondaryImage,
  title,
  price,
  options = [],
  variants = [],
  requireSelection = true,
}) {
  const { favorites = [], addToFavorites, removeFromFavorites, addToCart } = useShopifyCart();
  const navigate = useNavigate();

  // fallbacks for routing
  const numericId = id?.split("/").pop();
  const productRoute = handle ? `/products/${handle}` : `/products/${numericId || ""}`;

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

  // We favorite by PRODUCT id (GID). No variant required.
  const favKey = id;
  const isFavorite = useMemo(
    () => favorites.some((f) => (f.productId || f.id) === favKey),
    [favorites, favKey]
  );

  function handleToggleFavorite(e) {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(favKey);            // remove by product id
      toast("Removed from favorites");
    } else {
      addToFavorites({
        productId: favKey,
        id: favKey,                           // back-compat
        variantId: null,
        image,
        title,
        price,
        currency: "GBP",
        handle: handle || "",                 // 🔹 real handle saved here
      });
      toast.success("Saved to favorites");
    }
  }

  async function handlePrimaryAction(e) {
    e.preventDefault();
    e.stopPropagation();
    const resolvedVariantId = matchedVariant?.id || null;
    const needsVariant = requireSelection && options.length > 0 && !resolvedVariantId;

    if (needsVariant) {
      toast.error("Please select options first");
      navigate(`${productRoute}?select=1`);
      return;
    }
    if (!resolvedVariantId) {
      navigate(`${productRoute}?select=1`);
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
      navigate(`${productRoute}?select=1`);
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
    <Link to={productRoute} className={styles.productCard}>
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
            onClick={handleToggleFavorite}
            onMouseDown={(e) => e.stopPropagation()}
            aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
            aria-pressed={isFavorite}
            title={isFavorite ? "Remove favorite" : "Add favorite"}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>

          <button
            type="button"
            className={styles.iconButton}
            onClick={handlePrimaryAction}
            onMouseDown={(e) => e.stopPropagation()}
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
