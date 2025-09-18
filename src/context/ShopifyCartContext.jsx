import { createContext, useContext, useEffect, useState } from "react";
import {
  cartCreate,
  cartGet,
  cartLinesAdd,
  cartLinesRemove,
  cartLinesUpdate, // ⬅️ add this
} from "../api/shopify";

const Ctx = createContext(null);

const LS_CART_ID = "shopify_cart_id_v1";
const LS_FAV = "yafato_favorites_v1";

export function ShopifyCartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Favorites (local only) ---
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_FAV) || "[]"); } catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem(LS_FAV, JSON.stringify(favorites)); } catch {}
  }, [favorites]);

  // --- Boot/load Shopify cart ---
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const existing = localStorage.getItem(LS_CART_ID);
        if (existing) {
          const c = await cartGet(existing);
          if (alive && c) { setCart(c); return; }
        }
        const fresh = await cartCreate();
        if (!alive) return;
        localStorage.setItem(LS_CART_ID, fresh.id);
        setCart(fresh);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // --- Cart ops ---
  async function addToCart({ variantId, quantity = 1, attributes }) {
    if (!cart?.id) return { ok: false, error: "NO_CART" };
    if (!variantId) return { ok: false, error: "VARIANT_REQUIRED" };
    if (!(typeof quantity === "number" && quantity > 0)) return { ok: false, error: "BAD_QTY" };

    const updated = await cartLinesAdd(cart.id, [{ merchandiseId: variantId, quantity, attributes }]);
    setCart(updated);
    return { ok: true };
  }

  async function removeFromCart(lineId) {
    if (!cart?.id || !lineId) return { ok: false, error: "BAD_LINE" };
    const updated = await cartLinesRemove(cart.id, [lineId]);
    setCart(updated);
    return { ok: true };
  }

  // ✅ NEW: update quantity in cart
  async function updateLineQty(lineId, quantity) {
    if (!cart?.id || !lineId) return { ok: false, error: "BAD_LINE" };
    const q = Number(quantity);
    if (!Number.isFinite(q) || q < 1) return { ok: false, error: "BAD_QTY" };

    const updated = await cartLinesUpdate(cart.id, [{ id: lineId, quantity: q }]);
    setCart(updated);
    return { ok: true };
  }

  // ✅ NEW: change variant (size/color) for a cart line
  async function updateLineVariant(lineId, merchandiseId) {
    if (!cart?.id || !lineId || !merchandiseId) return { ok: false, error: "BAD_INPUT" };

    const updated = await cartLinesUpdate(cart.id, [{ id: lineId, merchandiseId }]);
    setCart(updated);
    return { ok: true };
  }

  // --- Favorites (local) ---
  function addToFavorites(item) {
    const vId = item?.variantId;
    if (!vId) return;
    setFavorites(prev =>
      prev.some(f => f.variantId === vId) ? prev : [...prev, { ...item, quantity: item.quantity || 1 }]
    );
  }

  function removeFromFavorites(variantId) {
    if (!variantId) return;
    setFavorites(prev => prev.filter(f => f.variantId !== variantId));
  }

  async function moveToCartFromFavorites(item) {
    const vId = item?.variantId;
    if (!vId) return { ok: false, error: "VARIANT_REQUIRED" };
    const res = await addToCart({ variantId: vId, quantity: item.quantity || 1 });
    if (res.ok) removeFromFavorites(vId);
    return res;
  }

  const checkoutUrl = cart?.checkoutUrl || "";

  const value = {
    // cart state
    cart,
    loading,
    checkoutUrl,

    // cart actions
    addToCart,
    removeFromCart,
    updateLineQty,       // ⬅️ expose
    updateLineVariant,   // ⬅️ expose

    // favorites
    favorites,
    addToFavorites,
    removeFromFavorites,
    moveToCartFromFavorites,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShopifyCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShopifyCart must be used within ShopifyCartProvider");
  return ctx;
}
