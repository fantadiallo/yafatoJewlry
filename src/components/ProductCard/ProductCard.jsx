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
 * Format currency in a locale-aware way. Falls back nicely.
 * @param {number|string} amount
 * @param {string} [currencyCode="NOK"]
 */
function formatPrice(amount, currencyCode = "NOK") {
  if (amount == null || amount === "") return "";
  const value = typeof amount === "string" ? Number(amount) : amount;
  try {
    // Pick a sensible locale based on currency
    const locale =
      currencyCode === "NOK" ? "nb-NO" :
      currencyCode === "GBP" ? "en-GB" :
      "en";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    // Fallback (e.g. "kr 1 299")
    return `${currencyCode} ${value.toFixed(2)}`;
  }
}

/**
 * ProductCard
 * @param {Object} props
 * @param {string} props.id                     gid://shopify/Product/123...
 * @param {string=} props.handle                product handle (slug)
 * @param {string=} props.image
 * @param {string=} props.secondaryImage
 * @param {string} props.title
 * @param {number|string=} props.price          // optional product-level price (fallback)
 * @param {Array=} props.options
 * @param {Array=} props.variants               // Shopify variants (flat or node style)
 * @param {boolean=} props.requireSelection
 * @param {string=} props.productHref           // explicit PDP base URL
 * @param {(variant:any)=>string=} props.variantHrefBuilder // build deep link for selected variant
 */
export default function ProductCard({
  id,
  handle,
  image,
  secondaryImage,
  title,
  price,
  options = [],
  variants = [],
  requireSelection = true,
  productHref,
  variantHrefBuilder,
}) {
  const { favorites = [], addToFavorites, removeFromFavorites, addToCart } =
    useShopifyCart();
  const navigate = useNavigate();

  const numericId = id?.split("/").pop();
  const computedRoute = handle ? `/products/${handle}` : `/products/${numericId || ""}`;
  const baseHref = productHref || computedRoute;

  const [selections, setSelections] = useState({});

  // Normalize variants into a friendly shape (MoneyV2 aware)
  const flatVariants = useMemo(
    () =>
      variants.map((v) => {
        const node = v.node ?? v;
        const priceObj = node.price || node.priceV2 || node?.presentmentPrices?.[0]?.price || {};
        const compareObj = node.compareAtPrice || node.compareAtPriceV2 || null;

        return {
          id: node.id,
          availableForSale: node.availableForSale,
          title: node.title,
          selectedOptions: node.selectedOptions || [],
          image: node.image || null,
          price: {
            amount: priceObj.amount != null ? String(priceObj.amount) : String(node.price ?? ""),
            currencyCode: priceObj.currencyCode || node.price?.currencyCode || "NOK",
          },
          compareAtPrice: compareObj
            ? {
                amount: String(compareObj.amount),
                currencyCode: compareObj.currencyCode || "NOK",
              }
            : null,
        };
      }),
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

  // Build deep link including selected options
  const selectedHref = useMemo(() => {
    if (matchedVariant && typeof variantHrefBuilder === "function") {
      try {
        return variantHrefBuilder(matchedVariant) || baseHref;
      } catch {
        return baseHref;
      }
    }
    return baseHref;
  }, [matchedVariant, variantHrefBuilder, baseHref]);

  // Favorite state
  const favKey = id;
  const isFavorite = useMemo(
    () => favorites.some((f) => (f.productId || f.id) === favKey),
    [favorites, favKey]
  );

  function handleToggleFavorite(e) {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(favKey);
      toast("Removed from favorites");
    } else {
      addToFavorites({
        productId: favKey,
        id: favKey,
        variantId: null,
        image,
        title,
        price,
        currency: "NOK",
        handle: handle || "",
      });
      toast.success("Saved to favorites");
    }
  }

  async function handlePrimaryAction(e) {
    e.preventDefault();
    e.stopPropagation();
    const resolvedVariantId = matchedVariant?.id || null;
    const needsVariant =
      requireSelection && options.length > 0 && !resolvedVariantId;

    if (needsVariant || !resolvedVariantId) {
      navigate(`${baseHref}?select=1`);
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
      navigate(`${baseHref}?select=1`);
    } else {
      toast.error("Couldn’t add to cart");
    }
  }

  function onSelectChange(name, value) {
    setSelections((prev) => ({
      ...prev,
      [name.toLowerCase().trim()]: value,
    }));
  }

  // ---- Price logic (sale awareness) ----
  /**
   * Choose which price to show:
   * - If a variant is selected → use that variant’s price/compareAtPrice
   * - Else show the CHEAPEST variant’s price (common pattern for product tiles)
   */
  const priceModel = useMemo(() => {
    const source =
      matchedVariant ||
      flatVariants.slice().sort((a, b) => Number(a.price.amount) - Number(b.price.amount))[0];

    if (source) {
      const pAmt = Number(source.price?.amount ?? 0);
      const pCur = source.price?.currencyCode || "NOK";
      const cAmt = source.compareAtPrice ? Number(source.compareAtPrice.amount) : null;
      const cCur = source.compareAtPrice?.currencyCode || pCur;

      const onSale = cAmt && cAmt > pAmt; // compareAt must be higher to be a "sale"
      const discountPct = onSale ? Math.round(((cAmt - pAmt) / cAmt) * 100) : 0;

      return {
        priceText: formatPrice(pAmt, pCur),
        compareText: onSale ? formatPrice(cAmt, cCur) : null,
        onSale,
        discountPct,
      };
    }

    // Fallback to product-level price prop if no variants present
    const fallbackAmount = typeof price === "string" ? Number(price) : price;
    return {
      priceText: fallbackAmount != null ? `Kr ${fallbackAmount}` : "",
      compareText: null,
      onSale: false,
      discountPct: 0,
    };
  }, [matchedVariant, flatVariants, price]);

  const resolvedVariantId = matchedVariant?.id || null;
  const needsVariant =
    requireSelection && options.length > 0 && !resolvedVariantId;
  const addAria = needsVariant ? "Select options" : "Add to Cart";

  return (
    <Link to={selectedHref} className={styles.productCard}>
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

        {/* ---- Price row (handles sales) ---- */}
        <p className={styles.priceRow} aria-live="polite">
          {priceModel.onSale ? (
            <>
              <span className={styles.priceSale}>{priceModel.priceText}</span>
              <span className={styles.priceCompare}>{priceModel.compareText}</span>
              <span className={styles.saleBadge}>-{priceModel.discountPct}%</span>
            </>
          ) : (
            <span className={styles.price}>{priceModel.priceText}</span>
          )}
        </p>

        {options?.length > 0 && (
          <div
            className={styles.optionsBar}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
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
            {/* Keep the variant-level live price as an extra hint if you want */}
            {/* (You can remove this block since the main priceRow already updates) */}
          </div>
        )}
      </div>
    </Link>
  );
}
