import styles from "./ProductInfo.module.scss";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { useShopifyCart } from "../../context/ShopifyCartContext";
import toast from "react-hot-toast";

function money(amount, currency = "GBP") {
  if (!amount && amount !== 0) return "";
  const n = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  try { return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(n); }
  catch { return `${n.toFixed(2)} ${currency}`; }
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
    options = [],
    handle,
    images = [],
    featuredImage
  } = product;

  const normVariants = useMemo(() => (
    variants.map(v => ({
      ...v,
      selectedOptions: (v.selectedOptions || []).map(o => ({
        name: o.name?.toLowerCase?.() || "",
        value: o.value
      }))
    }))
  ), [variants]);

  const optionNames = useMemo(
    () => options.map(o => o.name?.toLowerCase?.() || ""),
    [options]
  );

  const initialVariant = useMemo(
    () => normVariants.find(v => v.id === variantId) || normVariants[0] || null,
    [normVariants, variantId]
  );

  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const base = {};
    if (initialVariant?.selectedOptions?.length) {
      initialVariant.selectedOptions.forEach(o => { base[o.name] = o.value; });
    } else {
      options.forEach(o => { base[o.name.toLowerCase()] = o.values?.[0]; });
    }
    setSelectedOptions(base);
  }, [product?.id, optionNames.join("|")]);

  const activeVariant = useMemo(() => {
    if (!normVariants.length) return null;
    const entries = Object.entries(selectedOptions);
    const exact = normVariants.find(v =>
      (v.selectedOptions || []).every(o =>
        entries.some(([n, val]) => n === o.name && val === o.value)
      )
    );
    return exact || null;
  }, [normVariants, selectedOptions]);

  const selectedVariantId = activeVariant?.id || "";

  const [quantity, setQuantity] = useState(1);
  useEffect(() => { if (quantity < 1) setQuantity(1); }, [selectedVariantId]);

  const displayPrice = useMemo(() => {
    const amt = activeVariant?.price ?? price;
    const cur = activeVariant?.currency ?? currency;
    return money(amt, cur);
  }, [activeVariant, price, currency]);

  const primaryImage =
    (Array.isArray(images) && (typeof images[0] === "string" ? images[0] : images[0]?.url)) ||
    featuredImage?.url ||
    product.image ||
    "";

  const isFav = favorites.some(item => item.variantId === selectedVariantId);

  function onSelectOption(name, value) {
    const key = name.toLowerCase();
    setSelectedOptions(prev => ({ ...prev, [key]: value }));
  }

  const availabilityByOption = useMemo(() => {
    const map = new Map();
    options.forEach(opt => map.set(opt.name.toLowerCase(), new Set()));
    normVariants.forEach(v => {
      options.forEach(opt => {
        const key = opt.name.toLowerCase();
        const matchesOthers = Object.entries(selectedOptions).every(([n, val]) => {
          if (n === key) return true;
          const vo = (v.selectedOptions || []).find(o => o.name === n);
          return val ? vo?.value === val : true;
        });
        if (matchesOthers) {
          const val = (v.selectedOptions || []).find(o => o.name === key)?.value;
          if (val) map.get(key).add(val);
        }
      });
    });
    return map;
  }, [normVariants, options, selectedOptions]);

  async function toggleFavorite() {
    if (!selectedVariantId) {
      toast.error("Select options first");
      return;
    }
    const unitPrice = activeVariant?.price ?? price ?? 0;
    const cur = activeVariant?.currency ?? currency ?? "GBP";
    const payload = {
      ...product,
      title,
      handle,
      image: primaryImage || null,
      price: Number(unitPrice),
      currency: cur,
      variantId: selectedVariantId,
      quantity: 1
    };
    if (isFav) {
      removeFromFavorites(selectedVariantId);
      toast("Removed from favorites");
    } else {
      addToFavorites(payload);
      toast.success("Saved to favorites");
    }
  }

  async function add() {
    if (!selectedVariantId) {
      toast.error("Please select options first");
      return;
    }
    if (!activeVariant?.available) {
      toast.error("This option is out of stock");
      return;
    }
    const unitPrice = activeVariant?.price ?? price ?? 0;
    const cur = activeVariant?.currency ?? currency ?? "GBP";
    const res = await addToCart({
      title,
      handle,
      image: primaryImage || null,
      price: Number(unitPrice),
      currency: cur,
      variantId: selectedVariantId,
      quantity
    });
    if (res?.ok) toast.success("Added to cart");
    else if (res?.error === "VARIANT_REQUIRED") toast.error("Please select options first");
    else toast.error("Couldn’t add to cart");
  }

  const addDisabled = !activeVariant || activeVariant.available === false;

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
          disabled={!selectedVariantId}
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

      {options?.length > 0 && (
        <div className={styles.variants}>
          {options.map(opt => {
            const key = opt.name.toLowerCase();
            const enabled = availabilityByOption.get(key) || new Set();
            const isColor = isColorOption(opt.name);
            const currentVal = selectedOptions[key];

            return (
              <div key={opt.id || opt.name} className={styles.optionBlock}>
                <div className={styles.optionLabel}>
                  {opt.name}: <b>{currentVal}</b>
                </div>

                <div className={isColor ? styles.swatches : styles.pills}>
                  {(opt.values || []).map(val => {
                    const active = currentVal === val;
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
          disabled={addDisabled}
          aria-disabled={addDisabled}
        >
          {addDisabled ? "Out of stock" : "Add to Cart"}
        </button>
      </div>
    </section>
  );
}
