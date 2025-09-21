import { FaTimes, FaTrash } from "react-icons/fa";
import styles from "./SideCart.module.scss";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useShopifyCart } from "../../context/ShopifyCartContext";


function money(amt, cur) {
  const n = Number(amt || 0);
  const currency = cur || "GBP";
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currency}`;
  }
}

export default function SideCart({ isOpen, onClose }) {
  const {
    cart,
    checkoutUrl,
    removeFromCart,
    updateLineQty,      // <- make sure these are implemented in context
    updateLineVariant,  // <-
  } = useShopifyCart();

  const lines = cart?.lines?.edges?.map((e) => e.node) || [];

  const subtotalAmt = Number(cart?.cost?.subtotalAmount?.amount ?? 0);
  const subtotalCur = cart?.cost?.subtotalAmount?.currencyCode ?? "GBP";
  const totalAmtRaw = Number(cart?.cost?.totalAmount?.amount ?? subtotalAmt);
  const totalCur = cart?.cost?.totalAmount?.currencyCode ?? subtotalCur;

  // If your store has taxes, Shopify will fill totalTaxAmount. Otherwise we derive it (best-effort).
  const taxAmt = Number(
    cart?.cost?.totalTaxAmount?.amount ??
      Math.max(0, totalAmtRaw - subtotalAmt)
  );
  const vatRate =
    subtotalAmt > 0 && taxAmt > 0
      ? Math.round((taxAmt / subtotalAmt) * 100)
      : null;

  return (
    <div
      className={classNames(styles.sideCart, { [styles.open]: isOpen })}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <div className={styles.topBar}>
        <h3>Your Cart</h3>
        <button onClick={onClose} className={styles.closeBtn} aria-label="Close cart">
          <FaTimes />
        </button>
      </div>

      <div className={styles.items}>
        {lines.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          lines.map((line) => {
            const merch = line.merchandise; // ProductVariant
            const product = merch?.product;
            const img =
              merch?.image?.url ||
              product?.featuredImage?.url ||
              "https://via.placeholder.com/600x600?text=No+Image";
            const handle = product?.handle ? `/products/${product.handle}` : "/products";

            const unitAmt =
              merch?.price?.amount ??
              line.cost?.amountPerQuantity?.amount;
            const unitCur =
              merch?.price?.currencyCode ||
              line.cost?.amountPerQuantity?.currencyCode ||
              subtotalCur;

            const variantTitle =
              merch?.title && merch.title !== "Default Title" ? merch.title : null;

            // All variants for this product (requires you to include variants in CartFields)
            const variantNodes = product?.variants?.edges?.map((e) => e.node) || [];

            return (
              <div key={line.id} className={styles.cartItem}>
                <Link to={handle} onClick={onClose} className={styles.mediaLink}>
                  <img
                    src={img}
                    alt={product?.title || merch?.title || "Product image"}
                    loading="lazy"
                  />
                </Link>

                <div className={styles.details}>
                  <Link to={handle} onClick={onClose} className={styles.titleLink}>
                    <h4>{product?.title || merch?.title || "Untitled"}</h4>
                  </Link>

                  {/* Variant selector (if more than one variant exists) */}
                  {variantNodes.length > 1 && (
                    <label className={styles.variantSelectWrap}>
                      <span className={styles.label}>Variant</span>
                      <select
                        className={styles.variantSelect}
                        value={merch.id}
                        onChange={async (e) => {
                          const newVariantId = e.target.value;
                          if (newVariantId && newVariantId !== merch.id) {
                            await updateLineVariant(line.id, newVariantId);
                          }
                        }}
                      >
                        {variantNodes.map((v) => (
                          <option
                            key={v.id}
                            value={v.id}
                            disabled={v.availableForSale === false}
                          >
                            {v.title}{" "}
                            {v.availableForSale === false ? "— (Out of stock)" : ""}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  {/* Fallback display if only one variant */}
                  {!variantNodes.length && variantTitle && (
                    <p className={styles.variant}>
                      <strong>Variant:</strong> {variantTitle}
                    </p>
                  )}

                  <div className={styles.row}>
                    <p>
                      <strong>Unit:</strong> {money(unitAmt, unitCur)}
                    </p>

                    {/* Quantity stepper */}
                    <div className={styles.qtyWrap}>
                      <span className={styles.label}>Qty</span>
                      <button
                        className={styles.qtyBtn}
                        aria-label="Decrease quantity"
                        onClick={() =>
                          updateLineQty(line.id, Math.max(1, line.quantity - 1))
                        }
                      >
                        −
                      </button>
                      <input
                        className={styles.qtyInput}
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(e) => {
                          const q = Math.max(
                            1,
                            parseInt(e.target.value || "1", 10)
                          );
                          updateLineQty(line.id, q);
                        }}
                      />
                      <button
                        className={styles.qtyBtn}
                        aria-label="Increase quantity"
                        onClick={() => updateLineQty(line.id, line.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <p>
                    <strong>Line:</strong>{" "}
                    {money(
                      line.cost?.totalAmount?.amount,
                      line.cost?.totalAmount?.currencyCode || unitCur
                    )}
                  </p>

                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(line.id)}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {lines.length > 0 && (
        <div className={styles.total}>
          <p>
            <strong>Subtotal:</strong> {money(subtotalAmt, subtotalCur)}
          </p>
          <p>
            <strong>MVA{vatRate ? ` (${vatRate}%)` : ""}:</strong>{" "}
            {money(taxAmt, subtotalCur)}
          </p>
          <p>
            <strong>Total:</strong> {money(totalAmtRaw, totalCur)}
          </p>
        </div>
      )}

      {lines.length > 0 && checkoutUrl && (
        <button
          className={styles.checkoutBtn}
          onClick={() => (window.location.href = checkoutUrl)}
        >
          Go to Checkout
        </button>
      )}
    </div>
  );
}
