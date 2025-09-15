import styles from "./ProductInfo.module.scss";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { useShopifyCart } from "../../context/ShopifyCartContext";

function money(amount, currency = "GBP") {
  if (!amount) return "";
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(n);
}

function isColorOption(name) {
  return /color|colour|tone|hue/i.test(name);
}

export default function ProductInfo({ product }) {
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
    options = [], // [{id,name,values:[]}]
  } = product;

  // Default selection from variantId or first variant/options
  const initialVariant = useMemo(
    () => variants.find(v => v.id === variantId) || variants[0] || null,
    [variants, variantId]
  );

  const [selectedOptions, setSelectedOptions] = useState(() => {
    const base = {};
    if (initialVariant?.selectedOptions) {
      initialVariant.selectedOptions.forEach(o => (base[o.name] = o.value));
    } else {
      options.forEach(o => (base[o.name] = o.values?.[0]));
    }
    return base;
  });

  // Find exact matching variant for current selection
  const activeVariant = useMemo(() => {
    if (!variants.length) return null;
    const entries = Object.entries(selectedOptions);
    const exact = variants.find(v =>
      (v.selectedOptions || []).every(o =>
        entries.some(([n, val]) => n === o.name && val === o.value)
      )
    );
    return exact || variants[0] || null;
  }, [variants, selectedOptions]);

  const selectedVariantId = activeVariant?.id || variantId || "";
  const [quantity, setQuantity] = useState(1);

  const displayPrice = useMemo(() => {
    const amt = activeVariant?.price ?? price;
    const cur = activeVariant?.currency ?? currency;
    return money(amt, cur);
  }, [activeVariant, price, currency]);

  const isFav = favorites.some(item => item.variantId === selectedVariantId);

  function toggleFavorite() {
    if (!selectedVariantId) return;
    if (isFav) removeFromFavorites(selectedVariantId);
    else addToFavorites({ ...product, variantId: selectedVariantId, quantity: 1 });
  }

  function add() {
    if (!selectedVariantId || quantity < 1) return;
    addToCart({ ...product, variantId: selectedVariantId, quantity });
  }

  function onSelectOption(name, value) {
    setSelectedOptions(prev => ({ ...prev, [name]: value }));
  }

  // Compute which values are valid per option given current partial selection
  const availabilityByOption = useMemo(() => {
    const result = new Map(); // name -> Set(values)
    options.forEach(opt => result.set(opt.name, new Set()));

    variants.forEach(v => {
      options.forEach(opt => {
        const matchesOthers = Object.entries(selectedOptions).every(([n, val]) => {
          if (n === opt.name) return true;
          const vo = (v.selectedOptions || []).find(o => o.name === n);
          return val ? vo?.value === val : true;
        });
        if (matchesOthers) {
          const val = (v.selectedOptions || []).find(o => o.name === opt.name)?.value;
          if (val) result.get(opt.name).add(val);
        }
      });
    });

    return result;
  }, [variants, options, selectedOptions]);

  // Keep quantity valid (optional)
  useEffect(() => {
    if (quantity < 1) setQuantity(1);
  }, [selectedVariantId]); // eslint-disable-line

  return (
    <section className={styles.info}>
      <header className={styles.head}>
        <h1 className={styles.title}>{title}</h1>
        <button
          type="button"
          className={styles.heart}
          aria-pressed={isFav}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          onClick={toggleFavorite}
        >
          {isFav ? <FaHeart /> : <FaRegHeart />}
        </button>
      </header>

      {description ? <p className={styles.description}>{description}</p> : null}

      <div className={styles.pricing}>
        <span className={styles.price}>{displayPrice}</span>
        {oldPrice ? <span className={styles.oldPrice}>{money(oldPrice, currency)}</span> : null}
      </div>

      <ul className={styles.meta}>
        {material ? <li><strong>Material:</strong> {material}</li> : null}
        {finish ? <li><strong>Finish:</strong> {finish}</li> : null}
        {sku ? <li><strong>SKU:</strong> {sku}</li> : null}
      </ul>

      {/* Option selectors (Color, Size, Gender, Material, Age, etc.) */}
      {options?.length > 0 && (
        <div className={styles.variants}>
          {options.map(opt => {
            const enabled = availabilityByOption.get(opt.name) || new Set();
            const isColor = isColorOption(opt.name);

            return (
              <div key={opt.id || opt.name} className={styles.optionBlock}>
                <div className={styles.optionLabel}>
                  {opt.name}: <b>{selectedOptions[opt.name]}</b>
                </div>

                <div className={isColor ? styles.swatches : styles.pills}>
                  {(opt.values || []).map(val => {
                    const active = selectedOptions[opt.name] === val;
                    const disabled = !enabled.has(val);

                    return isColor ? (
                      <button
                        key={val}
                        type="button"
                        className={`${styles.swatch} ${active ? styles.active : ""}`}
                        title={val}
                        aria-label={val}
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

      <div className={styles.controls}>
        <label htmlFor="qty" className={styles.qtyLabel}>Quantity</label>
        <select
          id="qty"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className={styles.qtySelect}
        >
          {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <button
          className={styles.addBtn}
          onClick={add}
          disabled={activeVariant ? !activeVariant.available : false}
        >
          {activeVariant?.available === false ? "Out of stock" : "Add to Cart"}
        </button>
      </div>
    </section>
  );
}
