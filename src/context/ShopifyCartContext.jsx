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
 * @property {string} productId - The unique product ID (Shopify GID or numeric)
 * @property {string} id - Alias of productId
 * @property {string=} variantId - Selected variant ID (if applicable)
 * @property {string=} handle - Shopify product handle
 * @property {string=} title - Display title of the product
 * @property {string=} image - Product image URL
 * @property {number|string=} price - Price of the product
 * @property {string=} currency - Currency code (e.g. "GBP")
 * @property {number=} quantity - Quantity (defaults to 1)
 */

/**
 * @typedef {Object} ShopifyCartContextValue
 * @property {Object|null} cart - The current Shopify cart object
 * @property {boolean} loading - Whether the cart is being initialized or updated
 * @property {string} checkoutUrl - URL to Shopify checkout page
 * @property {(args: {variantId: string, quantity?: number, attributes?: Object}) => Promise<{ok: boolean, error?: string}>} addToCart
 * Add a line item to the cart
 * @property {(lineId: string) => Promise<{ok: boolean, error?: string}>} removeFromCart
 * Remove a line item from the cart
 * @property {(lineId: string, quantity: number) => Promise<{ok: boolean, error?: string}>} updateLineQty
 * Update quantity of a line item
 * @property {(lineId: string, merchandiseId: string) => Promise<{ok: boolean, error?: string}>} updateLineVariant
 * Update variant of a line item
 * @property {FavoriteItem[]} favorites - List of favorite items
 * @property {(item: FavoriteItem) => void} addToFavorites - Add item to favorites
 * @property {(key: string) => void} removeFromFavorites - Remove item from favorites by productId, id, or variantId
 * @property {(item: FavoriteItem) => Promise<{ok: boolean, error?: string}>} moveToCartFromFavorites
 * Move a favorite item into the cart and remove from favorites
 */

const Ctx = createContext(null);

const LS_CART_ID = "shopify_cart_id_v1";
const LS_FAV = "yafato_favorites_v2";

/**
 * ShopifyCartProvider
 *
 * Provides global cart and favorites state, backed by Shopify API calls.
 *
 * Features:
 * - Persists cart ID in localStorage across sessions.
 * - Syncs favorites to localStorage.
 * - Provides helpers for cart CRUD operations and favorites management.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Components that consume the cart context
 * @returns {JSX.Element} Provider wrapping children
 */
export function ShopifyCartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_FAV);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // persist favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_FAV, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // bootstrap or create cart
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const existingId = localStorage.getItem(LS_CART_ID);
        if (existingId) {
          const c = await cartGet(existingId);
          if (alive && c) {
            setCart(c);
            return;
          }
        }
        const fresh = await cartCreate();
        if (!alive) return;
        localStorage.setItem(LS_CART_ID, fresh.id);
        setCart(fresh);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function addToCart({ variantId, quantity = 1, attributes }) {
    if (!cart?.id) return { ok: false, error: "NO_CART" };
    if (!variantId) return { ok: false, error: "VARIANT_REQUIRED" };
    const q = Number(quantity);
    if (!Number.isFinite(q) || q < 1) return { ok: false, error: "BAD_QTY" };
    const updated = await cartLinesAdd(cart.id, [
      { merchandiseId: variantId, quantity: q, attributes },
    ]);
    setCart(updated);
    return { ok: true };
  }

  async function removeFromCart(lineId) {
    if (!cart?.id || !lineId) return { ok: false, error: "BAD_LINE" };
    const updated = await cartLinesRemove(cart.id, [lineId]);
    setCart(updated);
    return { ok: true };
  }

  async function updateLineQty(lineId, quantity) {
    if (!cart?.id || !lineId) return { ok: false, error: "BAD_LINE" };
    const q = Number(quantity);
    if (!Number.isFinite(q) || q < 1) return { ok: false, error: "BAD_QTY" };
    const updated = await cartLinesUpdate(cart.id, [{ id: lineId, quantity: q }]);
    setCart(updated);
    return { ok: true };
  }

  async function updateLineVariant(lineId, merchandiseId) {
    if (!cart?.id || !lineId || !merchandiseId)
      return { ok: false, error: "BAD_INPUT" };
    const updated = await cartLinesUpdate(cart.id, [
      { id: lineId, merchandiseId },
    ]);
    setCart(updated);
    return { ok: true };
  }

  function normalizeFav(item) {
    const productId = item?.productId || item?.id;
    if (!productId) return null;
    return {
      productId,
      id: productId,
      variantId: item?.variantId || null,
      handle: item?.handle || "",
      title: item?.title || "",
      image: item?.image || "",
      price: item?.price ?? "",
      currency: item?.currency || "GBP",
      quantity: Number(item?.quantity || 1),
    };
  }

  function addToFavorites(item) {
    const fav = normalizeFav(item);
    if (!fav) return;
    setFavorites((prev) =>
      prev.some((f) => (f.productId || f.id) === fav.productId)
        ? prev
        : [fav, ...prev]
    );
  }

  function removeFromFavorites(key) {
    if (!key) return;
    setFavorites((prev) =>
      prev.filter(
        (f) => (f.productId || f.id) !== key && f.variantId !== key
      )
    );
  }

  async function moveToCartFromFavorites(item) {
    const vId = item?.variantId;
    if (!vId) return { ok: false, error: "VARIANT_REQUIRED" };
    const res = await addToCart({
      variantId: vId,
      quantity: item.quantity || 1,
    });
    if (res.ok) removeFromFavorites(item.productId || item.id || vId);
    return res;
  }

  const checkoutUrl = cart?.checkoutUrl || "";

  const value = useMemo(
    () => ({
      cart,
      loading,
      checkoutUrl,
      addToCart,
      removeFromCart,
      updateLineQty,
      updateLineVariant,
      favorites,
      addToFavorites,
      removeFromFavorites,
      moveToCartFromFavorites,
    }),
    [cart, loading, checkoutUrl, favorites]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/**
 * Hook to consume the ShopifyCart context
 *
 * Provides access to cart operations and favorites list.
 *
 * @returns {ShopifyCartContextValue} The current cart context value
 * @throws {Error} If used outside of `ShopifyCartProvider`
 */
export function useShopifyCart() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useShopifyCart must be used within ShopifyCartProvider");
  return ctx;
}
