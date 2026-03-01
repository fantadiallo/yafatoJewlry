import { Link } from "react-router-dom";
import { useMemo } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useShopifyCart } from "../../context/ShopifyCartContext";
import styles from "./ProductCard.module.scss";

function formatPrice(amount, currencyCode = "NOK") {
  if (amount == null || amount === "") return "";
  const value = typeof amount === "string" ? Number(amount) : amount;

  try {
    const locale = currencyCode === "NOK" ? "nb-NO" : currencyCode === "GBP" ? "en-GB" : "en";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currencyCode} ${Number(value || 0).toFixed(2)}`;
  }
}

export default function ProductCard({
  id,
  handle,
  image,
  secondaryImage,
  title,
  price,
  compareAtPrice,
  currency = "NOK",
  productHref,
}) {
  const { favorites = [], addToFavorites, removeFromFavorites } = useShopifyCart();

  const numericId = id?.split("/").pop();
  const computedRoute = handle ? `/products/${handle}` : `/products/${numericId || ""}`;
  const href = productHref || computedRoute;

  const favKey = id;
  const isFavorite = useMemo(
    () => favorites.some((f) => (f.productId || f.id) === favKey),
    [favorites, favKey]
  );

  const priceModel = useMemo(() => {
    const pAmt = Number(price || 0);
    const cAmt = Number(compareAtPrice || 0);
    const onSale = cAmt && cAmt > pAmt;
    return {
      priceText: formatPrice(pAmt, currency),
      compareText: onSale ? formatPrice(cAmt, currency) : null,
      onSale,
    };
  }, [price, compareAtPrice, currency]);

  function handleToggleFavorite(e) {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      removeFromFavorites(favKey);
      toast("Removed from favorites");
      return;
    }

    addToFavorites({
      productId: favKey,
      id: favKey,
      image,
      title,
      price,
      currency,
      handle: handle || "",
    });
    toast.success("Saved to favorites");
  }

  return (
    <Link to={href} className={styles.productCard}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={`${styles.productImage} ${styles.defaultImage}`} />

        {secondaryImage && (
          <img src={secondaryImage} alt="" className={`${styles.productImage} ${styles.hoverImage}`} />
        )}

        <button
          type="button"
          className={styles.heartBtn}
          onClick={handleToggleFavorite}
          onMouseDown={(e) => e.stopPropagation()}
          aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
          aria-pressed={isFavorite}
          title={isFavorite ? "Remove favorite" : "Add favorite"}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>

        <p className={styles.priceRow} aria-label="Price">
          {priceModel.onSale ? (
            <>
              <span className={styles.priceSale}>{priceModel.priceText}</span>
              <span className={styles.priceCompare}>{priceModel.compareText}</span>
            </>
          ) : (
            <span className={styles.price}>{priceModel.priceText}</span>
          )}
        </p>
      </div>
    </Link>
  );
}

