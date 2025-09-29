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
 * @property {boolean} [available]
 * @property {boolean} [availableForSale]
 * @property {SelectedOption[]} [selectedOptions]
 */

/**
 * @typedef {Object} Option
 * @property {string} name
 * @property {string[]} values
 * @property {string} [id]
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {number|string} price
 * @property {string} [currency]
 * @property {number|string} [oldPrice]
 * @property {string} [material]
 * @property {string} [finish]
 * @property {string} [sku]
 * @property {string} [variantId]
 * @property {Variant[]} [variants]
 * @property {Option[]} [options]
 * @property {string} [handle]
 * @property {(string|{url:string})[]} [images]
 * @property {{url:string}} [featuredImage]
 * @property {string} [image]
 */

/**
 * Format a money value safely with fallback.
 * @param {number|string} amount
 * @param {string} [currency="GBP"]
 * @returns {string}
 */
function money(amount, currency = "GBP") {
  const n = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  if (!Number.isFinite(n)) return "";
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(n);
  } catch {
    return `${(n || 0).toFixed(2)} ${currency}`;
  }
}

/**
 * Heuristic to detect color-like option names.
 * @param {string} name
 * @returns {boolean}
 */
function isColorOption(name) {
  return /color|colour|tone|hue/i.test(name);
}

/**
 * Product purchase UI: variants, qty, favorites, add-to-cart.
 * Button sits directly under Quantity on all breakpoints.
 * 
 * @param {{product: Product, onPrimaryImageChange?: (url:string)=>void}} props
 */
export default function ProductInfo({ product, onPrimaryImageChange }) {
  const { addToCart, addToFavorites, removeFromFavorites, favorites = [] } = useShopifyCart();

  const {
    title,
    description,
    price,
    currency = "GBP",
    oldPrice,
    material,
    finish,
    sku,
    variantId,
    variants = [],
    options = [],
    handle,
    images = [],
    featuredImage,
  } = product;

  /** @type {Variant[]} */
  const normVariants = useMemo(
    () =>
      variants.map((v) => ({
        ...v,
        available: v.available ?? v.availableForSale,
        selectedOptions: (v.selectedOptions || []).map((o) => ({
          name: o.name?.toLowerCase?.() || "",
          value: o.value,
        })),
      })),
    [variants]
  );

  /** @type {string[]} */
  const optionNames = useMemo(() => options.map((o) => o.name?.toLowerCase?.() || ""), [options]);

  /** @type {Variant|null} */
  const initialVariant = useMemo(
    () => normVariants.find((v) => v.id === variantId) || normVariants[0] || null,
    [normVariants, variantId]
  );

  /** @type {Record<string,string>} */
  const [selectedOptions, setSelectedOptions] = useState({});
  useEffect(() => {
    const base = {};
    if (initialVariant?.selectedOptions?.length) {
      initialVariant.selectedOptions.forEach((o) => {
        base[o.name] = o.value;
      });
    } else {
      options.forEach((o) => {
        base[o.name.toLowerCase()] = o.values?.[0];
      });
    }
    setSelectedOptions(base);
  }, [product?.id, optionNames.join("|")]);

  /** @type {Variant|null} */
  const activeVariant = useMemo(() => {
    if (!normVariants.length) return null;
    const entries = Object.entries(selectedOptions);
    const exact = normVariants.find((v) =>
      (v.selectedOptions || []).every((o) => entries.some(([n, val]) => n === o.name && val === o.value))
    );
    return exact || null;
  }, [normVariants, selectedOptions]);

  const selectedVariantId = activeVariant?.id || "";

  const displayPriceStr = useMemo(() => {
    const amt = activeVariant?.price ?? price;
    const cur = activeVariant?.currency ?? currency;
    return money(amt, cur);
  }, [activeVariant, price, currency]);

  const displayOldPriceStr = useMemo(() => {
    if (!oldPrice) return "";
    const cur = activeVariant?.currency ?? currency;
    return money(oldPrice, cur);
  }, [oldPrice, activeVariant, currency]);

  const displayPriceNumber = Number(activeVariant?.price ?? price ?? 0);

  // ✅ Prefer the selected variant’s image (string URL from your mapper)
  const primaryImage =
    activeVariant?.image ||
    (Array.isArray(images) && (typeof images[0] === "string" ? images[0] : images[0]?.url)) ||
    featuredImage?.url ||
    product.image ||
    "";

  // ✅ Notify parent (page) whenever the primary image changes
  useEffect(() => {
    if (onPrimaryImageChange && primaryImage) {
      onPrimaryImageChange(primaryImage);
    }
  }, [onPrimaryImageChange, primaryImage]);

  const isFav = favorites.some((item) => item.variantId === selectedVariantId);

  /**
   * Select an option value.
   * @param {string} name
   * @param {string} value
   */
  function onSelectOption(name, value) {
    const key = name.toLowerCase();
    setSelectedOptions((prev) => ({ ...prev, [key]: value }));
  }

  /** @type {Map<string, Set<string>>} */
  const availabilityByOption = useMemo(() => {
    const map = new Map();
    options.forEach((opt) => map.set(opt.name.toLowerCase(), new Set()));
    normVariants.forEach((v) => {
      options.forEach((opt) => {
        const key = opt.name.toLowerCase();
        const matchesOthers = Object.entries(selectedOptions).every(([n, val]) => {
          if (n === key) return true;
          const vo = (v.selectedOptions || []).find((o) => o.name === n);
          return val ? vo?.value === val : true;
        });
        if (matchesOthers) {
          const val = (v.selectedOptions || []).find((o) => o.name === key)?.value;
          if (val) map.get(key).add(val);
        }
      });
    });
    return map;
  }, [normVariants, options, selectedOptions]);

  /**
   * Toggle favorite for current variant.
   * @returns {Promise<void>}
   */
  async function toggleFavorite() {
    if (!selectedVariantId) {
      toast.error("Select options first");
      return;
    }
    const unitPrice = displayPriceNumber;
    const cur = activeVariant?.currency ?? currency ?? "GBP";
    const payload = {
      ...product,
      title,
      handle,
      image: primaryImage || null,
      price: Number(unitPrice),
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

  const [qty, setQty] = useState(1);
  useEffect(() => {
    if (qty < 1) setQty(1);
  }, [selectedVariantId, qty]);

  function dec() {
    setQty((n) => Math.max(1, n - 1));
  }
  function inc() {
    setQty((n) => Math.min(99, n + 1));
  }

  /**
   * Add current variant to cart.
   * @returns {Promise<void>}
   */
  async function add() {
    if (!selectedVariantId) {
      toast.error("Please select options first");
      return;
    }
    if (activeVariant?.available === false) {
      toast.error("This option is out of stock");
      return;
    }
    const cur = activeVariant?.currency ?? currency ?? "GBP";
    const res = await addToCart({
      title,
      handle,
      image: primaryImage || null,
      price: displayPriceNumber,
      currency: cur,
      variantId: selectedVariantId,
      quantity: qty,
    });
    if (res?.ok) toast.success("Added to cart");
    else if (res?.error === "VARIANT_REQUIRED") toast.error("Please select options first");
    else toast.error("Couldn’t add to cart");
  }

  const addDisabled = !activeVariant || activeVariant.available === false;

  const [openDesc, setOpenDesc] = useState(false);

  return (
    <section className={styles.info} id="productInfoRoot" aria-live="polite">
      <header className={styles.head}>
        <h1 className={styles.title}>{title}</h1>
        <button
          type="button"
          className={styles.heart}
          aria-pressed={isFav}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          onClick={toggleFavorite}
          disabled={!selectedVariantId}
          title={!selectedVariantId ? "Select options first" : undefined}
        >
          {isFav ? <FaHeart /> : <FaRegHeart />}
        </button>
      </header>

      {description ? (
        <div className={`${styles.description} ${openDesc ? styles.expanded : ""}`}>
          <p>{description}</p>
          <button type="button" className={styles.readMore} onClick={() => setOpenDesc((v) => !v)}>
            {openDesc ? "Show less" : "Read more"}
          </button>
        </div>
      ) : null}

      <div className={styles.pricing} aria-live="polite">
        <span className={styles.price}>{displayPriceStr}</span>
        {oldPrice ? <span className={styles.oldPrice}>{displayOldPriceStr}</span> : null}
      </div>

      <ul className={styles.meta}>
        {material ? <li><strong>Material:</strong> {material}</li> : null}
        {finish ? <li><strong>Finish:</strong> {finish}</li> : null}
        {sku ? <li><strong>SKU:</strong> {sku}</li> : null}
      </ul>

      {options?.length > 0 && (
        <div className={styles.optionsWrap}>
          {options.map((opt) => {
            const key = opt.name.toLowerCase();
            const enabled = availabilityByOption.get(key) || new Set();
            const isColor = isColorOption(opt.name);
            const currentVal = selectedOptions[key];

            return (
              <div key={opt.id || opt.name} className={styles.optionBlock}>
                <div className={styles.optionLabel}>
                  {opt.name}: <b>{currentVal}</b>
                </div>

                <div className={isColor ? styles.swatches : styles.pills} role="tablist">
                  {(opt.values || []).map((val) => {
                    const active = currentVal === val;
                    const disabled = !enabled.has(val);

                    return isColor ? (
                      <button
                        key={val}
                        type="button"
                        className={`${styles.swatch} ${active ? styles.active : ""}`}
                        title={val}
                        aria-label={val}
                        aria-selected={active}
                        disabled={disabled}
                        onClick={() => !disabled && onSelectOption(opt.name, val)}
                      >
                        <span className={styles.swatchDot} style={{ background: val }} />
                      </button>
                    ) : (
                      <button
                        key={val}
                        type="button"
                        className={`${styles.pill} ${active ? styles.active : ""}`}
                        aria-selected={active}
                        disabled={disabled}
                        onClick={() => !disabled && onSelectOption(opt.name, val)}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quantity + Add to Cart (always stacked) */}
      <div className={styles.controls}>
        <div className={styles.qtyGroup}>
          <label htmlFor="qty" className={styles.qtyLabel}>Quantity</label>
          <div className={styles.stepper}>
            <button type="button" onClick={dec} aria-label="Decrease quantity">−</button>
            <input
              id="qty"
              inputMode="numeric"
              pattern="[0-9]*"
              value={qty}
              onChange={(e) => {
                const v = e.target.value.replace(/[^\d]/g, "");
                setQty(Math.min(99, Math.max(1, Number(v || 1))));
              }}
            />
            <button type="button" onClick={inc} aria-label="Increase quantity">+</button>
          </div>
        </div>

        <button className={styles.addBtn} onClick={add} disabled={addDisabled} aria-disabled={addDisabled}>
          {addDisabled ? "Out of stock" : "Add to Cart"}
        </button>
      </div>
    </section>
  );
}
