import { Link, useNavigate } from "react-router-dom";
import styles from "./ProductCard.module.scss";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useMemo, useState } from "react";
import { useShopifyCart } from "../../context/ShopifyCartContext";
import toast from "react-hot-toast";

function resolveVariant(variants, selections) {
  if (!variants?.length) return null;
  const keys = Object.keys(selections || {});
  if (!keys.length) return null;
  return variants.find(v => {
    const opts = v.selectedOptions || v.node?.selectedOptions || [];
    return opts.every(o => {
      const n = o.name?.toLowerCase?.().trim();
      const val = o.value?.toLowerCase?.().trim();
      const sel = selections[n];
      return sel && sel.toLowerCase().trim() === val;
    });
  }) || null;
}

export default function ProductCard({
  id,
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
  const shortId = id?.split("/").pop();
  const [selections, setSelections] = useState({});
  const isFavorite = favorites.some((item) => item.id === id);

  const flatVariants = useMemo(
    () => variants.map(v => ({
      id: v.id || v.node?.id,
      availableForSale: v.availableForSale ?? v.node?.availableForSale,
      price: v.price || v.node?.price,
      selectedOptions: v.selectedOptions || v.node?.selectedOptions || [],
      title: v.title || v.node?.title
    })),
    [variants]
  );

  const matchedVariant = useMemo(
    () => resolveVariant(
      flatVariants,
      Object.fromEntries(Object.entries(selections).map(([k, v]) => [k.toLowerCase(), v]))
    ),
    [flatVariants, selections]
  );

  const resolvedVariantId = matchedVariant?.id || null;
  const needsVariant = requireSelection && options.length > 0 && !resolvedVariantId;

  function handleToggleFavorite(e) {
    e.preventDefault();
    if (isFavorite) {
      removeFromFavorites(resolvedVariantId || id);
      toast("Removed from favorites");
    } else {
      addToFavorites({ id, variantId: resolvedVariantId, image, title, price });
      toast.success("Saved to favorites");
    }
  }

  async function handlePrimaryAction(e) {
    e.preventDefault();
    if (needsVariant && options.length) {
      toast.error("Please select options first");
      navigate(`/products/${shortId}?select=1`);
      return;
    }
    if (!resolvedVariantId) {
      navigate(`/products/${shortId}?select=1`);
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
      navigate(`/products/${shortId}?select=1`);
    } else {
      toast.error("Couldn’t add to cart");
    }
  }

  function onSelectChange(name, value) {
    setSelections(prev => ({ ...prev, [name.toLowerCase().trim()]: value }));
  }

  const addLabel = needsVariant ? "Select" : "+ Cart";
  const addAria = needsVariant ? "Select options" : "Add to Cart";

  return (
    <Link to={`/products/${shortId}`} className={styles.productCard}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={`${styles.productImage} ${styles.defaultImage}`} />
        {secondaryImage && (
          <img src={secondaryImage} alt={`${title} alternate`} className={`${styles.productImage} ${styles.hoverImage}`} />
        )}

        <div className={styles.iconBar}>
          <button
            className={styles.iconButton}
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
            title={isFavorite ? "Remove favorite" : "Add favorite"}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>

          <button
            className={styles.iconButton}
            onClick={handlePrimaryAction}
            aria-label={addAria}
            title={addAria}
            data-needs-variant={needsVariant ? "1" : "0"}
          >
            {addLabel}
          </button>
        </div>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.price}>£ {price}</p>

        {options?.length > 0 && (
          <div className={styles.optionsBar} onClick={(e) => e.preventDefault()}>
            {options.map(opt => {
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
                    {values.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </label>
              );
            })}
            {matchedVariant && matchedVariant.price?.amount && (
              <div className={styles.variantPrice}>
                £ {Number(matchedVariant.price.amount).toFixed(2)}
                {!matchedVariant.availableForSale && <span className={styles.badge}>Sold out</span>}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
