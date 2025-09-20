import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  cartCreate,
  cartGet,
  cartLinesAdd,
  cartLinesRemove,
  cartLinesUpdate,
} from "../api/shopify";

/**
 * @typedef {Object} FavoriteItem
 * @property {string} productId    - Shopify GID for the product (gid://shopify/Product/###)
 * @property {string} id           - Same as productId (back-compat)
 * @property {string=} variantId   - Optional variant GID (only when known)
 * @property {string=} handle      - Shopify product handle
 * @property {string=} title       - Product title
 * @property {string=} image       - Preferred image URL
 * @property {number|string=} price - Optional display price
 * @property {string=} currency    - Currency code (default GBP)
 * @property {number=} quantity    - Default quantity to add to cart (default 1)
 */

const Ctx = createContext(null);
const LS_CART_ID = "shopify_cart_id_v1";
const LS_FAV = "yafato_favorites_v2"; // bumped version to ensure clean slate

export function ShopifyCartProvider({ children }) {
  // ---- Cart state ----
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---- Favorites state (persisted, product-based) ----
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_FAV);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try { localStorage.setItem(LS_FAV, JSON.stringify(favorites)); } catch {}
  }, [favorites]);

  // ---- Bootstrap cart ----
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const existingId = localStorage.getItem(LS_CART_ID);
        if (existingId) {
          const c = await cartGet(existingId);
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

  // ---------------------------
  // Cart operations
  // ---------------------------

  /**
   * Add a variant to the Shopify cart.
   * @param {{variantId:string, quantity?:number, attributes?:Array}} input
   * @returns {Promise<{ok:boolean, error?:string}>}
   */
  async function addToCart({ variantId, quantity = 1, attributes }) {
    if (!cart?.id) return { ok:false, error:"NO_CART" };
    if (!variantId) return { ok:false, error:"VARIANT_REQUIRED" };
    const q = Number(quantity);
    if (!Number.isFinite(q) || q < 1) return { ok:false, error:"BAD_QTY" };

    const updated = await cartLinesAdd(cart.id, [{ merchandiseId: variantId, quantity: q, attributes }]);
    setCart(updated);
    return { ok:true };
  }

  /**
   * Remove a line from cart by lineId.
   * @param {string} lineId
   */
  async function removeFromCart(lineId) {
    if (!cart?.id || !lineId) return { ok:false, error:"BAD_LINE" };
    const updated = await cartLinesRemove(cart.id, [lineId]);
    setCart(updated);
    return { ok:true };
  }

  /**
   * Update quantity of a cart line.
   * @param {string} lineId
   * @param {number} quantity
   */
  async function updateLineQty(lineId, quantity) {
    if (!cart?.id || !lineId) return { ok:false, error:"BAD_LINE" };
    const q = Number(quantity);
    if (!Number.isFinite(q) || q < 1) return { ok:false, error:"BAD_QTY" };

    const updated = await cartLinesUpdate(cart.id, [{ id: lineId, quantity: q }]);
    setCart(updated);
    return { ok:true };
  }

  /**
   * Change the variant (merchandiseId) attached to a cart line.
   * @param {string} lineId
   * @param {string} merchandiseId
   */
  async function updateLineVariant(lineId, merchandiseId) {
    if (!cart?.id || !lineId || !merchandiseId) return { ok:false, error:"BAD_INPUT" };
    const updated = await cartLinesUpdate(cart.id, [{ id: lineId, merchandiseId }]);
    setCart(updated);
    return { ok:true };
  }

  // ---------------------------
  // Favorites (product-based)
  // ---------------------------

  /**
   * Normalize a favorite record to our canonical structure.
   * Accepts legacy { id } or modern { productId }.
   * @param {Partial<FavoriteItem>} item
   * @returns {FavoriteItem|null}
   */
  function normalizeFav(item) {
    const productId = item?.productId || item?.id;
    if (!productId) return null;
    return {
      productId,
      id: productId,                 // back-compat
      variantId: item?.variantId || null,
      handle: item?.handle || "",
      title: item?.title || "",
      image: item?.image || "",
      price: item?.price ?? "",
      currency: item?.currency || "GBP",
      quantity: Number(item?.quantity || 1),
    };
  }

  /**
   * Add a product to favorites (no variant required).
   * Will ignore duplicates by productId.
   * @param {Partial<FavoriteItem>} item
   */
  function addToFavorites(item) {
    const fav = normalizeFav(item);
    if (!fav) return;
    setFavorites(prev => {
      if (prev.some(f => (f.productId || f.id) === fav.productId)) return prev;
      return [fav, ...prev];
    });
  }

  /**
   * Remove a favorite by productId or variantId.
   * @param {string} key - productId (preferred) or variantId (legacy)
   */
  function removeFromFavorites(key) {
    if (!key) return;
    setFavorites(prev =>
      prev.filter(f => (f.productId || f.id) !== key && f.variantId !== key)
    );
  }

  /**
   * Attempt to move a favorite to cart.
   * Requires a variantId. If not present, the caller (e.g. FavoritesCart)
   * should resolve a variant first and then call this.
   * @param {FavoriteItem} item
   */
  async function moveToCartFromFavorites(item) {
    const vId = item?.variantId;
    if (!vId) return { ok:false, error:"VARIANT_REQUIRED" };
    const res = await addToCart({ variantId: vId, quantity: item.quantity || 1 });
    if (res.ok) removeFromFavorites(item.productId || item.id || vId);
    return res;
  }

  const checkoutUrl = cart?.checkoutUrl || "";

  const value = useMemo(() => ({
    // cart
    cart,
    loading,
    checkoutUrl,
    addToCart,
    removeFromCart,
    updateLineQty,
    updateLineVariant,

    // favorites
    favorites,
    addToFavorites,
    removeFromFavorites,
    moveToCartFromFavorites,
  }), [cart, loading, checkoutUrl, favorites]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/**
 * Access cart & favorites context.
 */
export function useShopifyCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShopifyCart must be used within ShopifyCartProvider");
  return ctx;
}
