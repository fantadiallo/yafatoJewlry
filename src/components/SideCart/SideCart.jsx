import { FaTimes, FaTrash } from "react-icons/fa";
import styles from "./SideCart.module.scss";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useShopifyCart } from "../../context/ShopifyCartContext";

function formatMoney(amount, currency = "GBP") {
  const n = Number(amount || 0);
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currency}`;
  }
}

// Build a product URL from our parsed cart item
function productPath(item) {
  if (item?.handle) return `/products/${item.handle}`;
  return "/products";
}

const PLACEHOLDER = "https://via.placeholder.com/600x600?text=No+Image";

export default function SideCart({ isOpen, onClose }) {
  const { cartItems = [], checkoutUrl, removeFromCart } = useShopifyCart();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );
  const currency = cartItems[0]?.currency || "GBP";
  const mvaRate = 0.25;
  const mva = subtotal * mvaRate;
  const totalWithMva = subtotal + mva;

  return (
    <div
      className={classNames(styles.sideCart, { [styles.open]: isOpen })}
      role="dialog"
      aria-label="Shopping cart"
      aria-modal="true"
    >
      <div className={styles.topBar}>
        <h3>Your Cart</h3>
        <button onClick={onClose} className={styles.closeBtn} aria-label="Close cart">
          <FaTimes />
        </button>
      </div>

      <div className={styles.items}>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cartItems.map((item) => {
            const to = productPath(item);
            const img = item.image || PLACEHOLDER;
            const qty = Number(item.quantity || 1);
            const unit = Number(item.price || 0);
            const lineTotal = unit * qty;

            return (
              <div key={item.lineId} className={styles.cartItem}>
                <Link
                  to={to}
                  onClick={onClose}
                  className={styles.mediaLink}
                  aria-label={`View ${item.title || "product"}`}
                >
                  <img
                    src={img}
                    alt={item.title || "Product image"}
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                    loading="lazy"
                  />
                </Link>

                <div className={styles.details}>
                  <Link to={to} onClick={onClose} className={styles.titleLink}>
                    <h4>{item.title || "Untitled"}</h4>
                  </Link>

                  <p>Qty: {qty}</p>
                  <p>Unit: {formatMoney(unit, item.currency || currency)}</p>
                  <p>
                    <strong>Line:</strong> {formatMoney(lineTotal, item.currency || currency)}
                  </p>

                  {/* Use the Shopify cart line id to remove */}
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.lineId)}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {cartItems.length > 0 && (
        <div className={styles.total}>
          <p>
            <strong>Subtotal:</strong> {formatMoney(subtotal, currency)}
          </p>
          <p>
            <strong>25% MVA:</strong> {formatMoney(mva, currency)}
          </p>
          <p>
            <strong>Total incl. MVA:</strong> {formatMoney(totalWithMva, currency)}
          </p>
        </div>
      )}

      {cartItems.length > 0 && checkoutUrl && (
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
