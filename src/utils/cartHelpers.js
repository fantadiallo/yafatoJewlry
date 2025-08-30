// utils/cartHelpers.js
export function addToCart(item) {
  const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
  storedCart.push(item);
  localStorage.setItem('cartItems', JSON.stringify(storedCart));
}
