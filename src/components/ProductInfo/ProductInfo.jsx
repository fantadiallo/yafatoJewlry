import styles from "./ProductInfo.module.scss";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { useShopifyCart } from "../../context/ShopifyCartContext";
import toast from "react-hot-toast";

/**
 * @typedef {Object} SelectedOption
 * @property {string} name
 * @property {string} value
 */

/**
 * @typedef {Object} Variant
 * @property {string} id
 * @property {number|string} price
 * @property {string} [currency]
 * @property {number|string|null} [compareAtPrice]
 * @property {boolean} [available]
 * @property {boolean} [availableForSale]
 * @property {SelectedOption[]} [selectedOptions]
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {number|string} [price]
 * @property {string} [currency]
 * @property {Variant[]} [variants]
 * @property {{id:string,name:string,values:string[]}[]} [options]
 * @property {string} [handle]
 * @property {(string|{url:string})[]} [images]
 * @property {{url:string}} [featuredImage]
 * @property {string} [image]
 */

/**
 * Format money consistently.
 * @param {number|string} amount
 * @param {string} [currency="GBP"]
 */
function money(amount, currency = "GBP") {
  const n = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  if (!Number.isFinite(n)) return "";
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currency}`;
  }
}

/**
 * Detect color-like option names.
 * @param {string} name
 * @returns {boolean}
 */
function isColorOption(name) {
  return /color|colour|tone|hue/i.test(name);
}

/**
 * ProductInfo Component
 * - Shows title, favorite button, sale price with compareAtPrice
 * - Handles variant options and add-to-cart
 * @param {{product: Product, onPrimaryImageChange?: (url:string)=>void}} props
 */
export default function ProductInfo({ product, onPrimaryImageChange }) {
  const { addToCart, addToFavorites, removeFromFavorites, favorites = [] } = useShopifyCart();

  const {
    title,
    description,
    variants = [],
    options = [],
    handle,
    images = [],
    featuredImage,
    currency = "GBP",
  } = product;

  /** Normalize variants and make sure we include compareAtPrice */
  const normVariants = useMemo(
    () =>
      variants.map((v) => ({
        ...v,
        available: v.available ?? v.availableForSale,
        price: Number(v.price ?? 0),
        compareAtPrice: v.compareAtPrice != null ? Number(v.compareAtPrice) : null,
        selectedOptions: (v.selectedOptions || []).map((o) => ({
          name: o.name?.toLowerCase?.() || "",
          value: o.value,
        })),
      })),
    [variants]
  );

  const [selectedOptions, setSelectedOptions] = useState({});
  const [qty, setQty] = useState(1);

  /** Find active variant based on selected options */
  const activeVariant = useMemo(() => {
    if (!normVariants.length) return null;
    const entries = Object.entries(selectedOptions);
    return (
      normVariants.find((v) =>
        (v.selectedOptions || []).every((o) =>
          entries.some(([n, val]) => n === o.name && val === o.value)
        )
      ) || normVariants[0]
    );
  }, [normVariants, selectedOptions]);

  const selectedVariantId = activeVariant?.id || "";

  /** Compute display prices (sale + compare) */
  const priceNum = activeVariant?.price ?? 0;
  const compareNum = activeVariant?.compareAtPrice ?? null;
  const cur = activeVariant?.currency ?? currency;
  const onSale = compareNum && compareNum > priceNum;
  const discountPct = onSale ? Math.round(((compareNum - priceNum) / compareNum) * 100) : 0;

  const priceStr = money(priceNum, cur);
  const compareStr = onSale ? money(compareNum, cur) : null;

  /** Primary image logic */
  const primaryImage =
    activeVariant?.image ||
    (Array.isArray(images) && (typeof images[0] === "string" ? images[0] : images[0]?.url)) ||
    featuredImage?.url ||
    product.image ||
    "";

  useEffect(() => {
    if (onPrimaryImageChange && primaryImage) onPrimaryImageChange(primaryImage);
  }, [onPrimaryImageChange, primaryImage]);

  /** Handle option change */
  function onSelectOption(name, value) {
    setSelectedOptions((prev) => ({ ...prev, [name.toLowerCase()]: value }));
  }

  /** Favorites toggle */
  const isFav = favorites.some((item) => item.variantId === selectedVariantId);
  async function toggleFavorite() {
    if (!selectedVariantId) return toast.error("Select options first");
    const payload = {
      ...product,
      handle,
      image: primaryImage || null,
      price: priceNum,
      currency: cur,
      variantId: selectedVariantId,
      quantity: 1,
    };
    if (isFav) {
      removeFromFavorites(selectedVariantId);
      toast("Removed from favorites");
    } else {
      addToFavorites(payload);
      toast.success("Saved to favorites");
    }
  }

  /** Quantity controls */
  const dec = () => setQty((n) => Math.max(1, n - 1));
  const inc = () => setQty((n) => Math.min(99, n + 1));

  /** Add to cart */
  async function add() {
    if (!selectedVariantId) return toast.error("Please select options first");
    if (activeVariant?.available === false) return toast.error("Out of stock");

    const res = await addToCart({
      title,
      handle,
      image: primaryImage,
      price: priceNum,
      currency: cur,
      variantId: selectedVariantId,
      quantity: qty,
    });

    if (res?.ok) toast.success("Added to cart");
    else toast.error("Couldn't add to cart");
  }

  const addDisabled = !activeVariant || activeVariant.available === false;

  return (
    <section className={styles.info} id="productInfoRoot" aria-live="polite">
      <header className={styles.head}>
        <h1 className={styles.title}>{title}</h1>
        <button
          type="button"
          className={styles.heart}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          onClick={toggleFavorite}
        >
          {isFav ? <FaHeart /> : <FaRegHeart />}
        </button>
      </header>

      {/* PRICE AREA */}
      <div className={styles.pricing} aria-live="polite">
        {onSale ? (
          <>
            <span className={styles.price}>{priceStr}</span>
            <span className={styles.oldPrice}>{compareStr}</span>
            <span className={styles.discountBadge}>-{discountPct}%</span>
          </>
        ) : (
          <span className={styles.price}>{priceStr}</span>
        )}
      </div>

      {description && (
        <div className={styles.description}>
          <p>{description}</p>
        </div>
      )}

      {/* OPTIONS */}
      {options.length > 0 && (
        <div className={styles.optionsWrap}>
          {options.map((opt) => {
            const currentVal = selectedOptions[opt.name.toLowerCase()];
            const isColor = isColorOption(opt.name);
            return (
              <div key={opt.id || opt.name} className={styles.optionBlock}>
                <div className={styles.optionLabel}>
                  {opt.name}: <b>{currentVal}</b>
                </div>
                <div className={isColor ? styles.swatches : styles.pills}>
                  {opt.values.map((val) =>
                    isColor ? (
                      <button
                        key={val}
                        type="button"
                        className={`${styles.swatch} ${
                          currentVal === val ? styles.active : ""
                        }`}
                        title={val}
                        onClick={() => onSelectOption(opt.name, val)}
                      >
                        <span
                          className={styles.swatchDot}
                          style={{ background: val }}
                        />
                      </button>
                    ) : (
                      <button
                        key={val}
                        type="button"
                        className={`${styles.pill} ${
                          currentVal === val ? styles.active : ""
                        }`}
                        onClick={() => onSelectOption(opt.name, val)}
                      >
                        {val}
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUANTITY + ADD TO CART */}
      <div className={styles.controls}>
        <div className={styles.qtyGroup}>
          <div className={styles.stepper}>
            <button onClick={dec} aria-label="Decrease quantity">
              −
            </button>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={qty}
              onChange={(e) =>
                setQty(Math.min(99, Math.max(1, Number(e.target.value || 1))))
              }
            />
            <button onClick={inc} aria-label="Increase quantity">
              +
            </button>
          </div>
        </div>

        <button
          className={styles.addBtn}
          onClick={add}
          disabled={addDisabled}
        >
          {addDisabled ? "Out of stock" : "Add to Cart"}
        </button>
      </div>
    </section>
  );
}
