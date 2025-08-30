import { FaTimes, FaTrash } from "react-icons/fa";
import styles from "./SideCart.module.scss";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useShopifyCart } from "../../context/ShopifyCartContext";

export default function SideCart({ isOpen, onClose }) {
  const { cartItems, checkoutUrl, removeFromCart } = useShopifyCart();

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const mva = subtotal * 0.25;
  const totalWithMva = subtotal + mva;

  return (
    <div className={classNames(styles.sideCart, { [styles.open]: isOpen })}>
      <div className={styles.topBar}>
        <h3>Your Cart</h3>
        <button onClick={onClose} className={styles.closeBtn}>
          <FaTimes />
        </button>
      </div>

      <div className={styles.items}>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <Link to={`/products/${item.variantId}`} onClick={onClose}>
                <img
                  src={item.image || "https://via.placeholder.com/400x400?text=No+Image"}
                  alt={item.title || "No title"}
                />
              </Link>
              <div className={styles.details}>
                <h4>{item.title || "No title"}</h4>
                <p>Quantity: {item.quantity}</p>
                <p>{item.price?.toFixed(2)} £</p>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.id)}
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className={styles.total}>
          <p><strong>Subtotal:</strong> {subtotal.toFixed(2)} £</p>
          <p><strong>25% MVA:</strong> {mva.toFixed(2)} £</p>
          <p><strong>Total incl. MVA:</strong> {totalWithMva.toFixed(2)} £</p>
        </div>
      )}

      {cartItems.length > 0 && (
        <button
          className={styles.checkoutBtn}
          onClick={() => window.location.href = checkoutUrl}
        >
          Go to Checkout
        </button>
      )}
    </div>
  );
}
