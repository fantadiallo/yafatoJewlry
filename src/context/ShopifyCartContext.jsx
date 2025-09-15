import { createContext, useContext, useEffect, useState } from "react";

const DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

export const ShopifyCartContext = createContext();

export function ShopifyCartProvider({ children }) {
  const [cartId, setCartId] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("shopify_cart"));
    if (storedCart?.id) {
      setCartId(storedCart.id);
      setCheckoutUrl(storedCart.checkoutUrl);
      fetchCartLines(storedCart.id);
    } else {
      createCart();
    }

    const storedFavs =
      JSON.parse(localStorage.getItem("shopify_favorites")) || [];
    setFavorites(storedFavs);
  }, []);

  async function createCart() {
    const res = await fetch(`https://${DOMAIN}/api/2024-04/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
      },
      body: JSON.stringify({
        query: `mutation { cartCreate { cart { id checkoutUrl } } }`,
      }),
    });

    const json = await res.json();
    const cart = json?.data?.cartCreate?.cart;
    if (cart?.id) {
      setCartId(cart.id);
      setCheckoutUrl(cart.checkoutUrl);
      localStorage.setItem("shopify_cart", JSON.stringify(cart));
    }
  }

  async function fetchCartLines(id) {
    const res = await fetch(`https://${DOMAIN}/api/2024-04/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
      },
      body: JSON.stringify({
        query: `
          query getCart($id: ID!) {
            cart(id: $id) {
              lines(first: 20) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        price {
                          amount
                        }
                        product {
                          handle
                          title
                          images(first: 1) {
                            edges {
                              node {
                                url
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              checkoutUrl
            }
          }
        `,
        variables: { id },
      }),
    });

    const json = await res.json();
    console.log("🛒 Shopify cart response:", JSON.stringify(json, null, 2));

    const edges = json?.data?.cart?.lines?.edges || [];

    const parsedItems = edges.map((edge) => {
      const variant = edge.node.merchandise;
      const product = variant.product;

      return {
        lineId: edge.node.id, // Shopify Line Item ID
        variantId: variant.id,
        title:
          variant.title === "Default Title"
            ? product.title
            : `${product.title} - ${variant.title}`,
        image:
          product.images.edges[0]?.node.url ||
          "https://via.placeholder.com/400x400?text=No+Image",
        price: Number(variant.price.amount),
        quantity: edge.node.quantity,
        handle: product.handle,
        currency: "GBP",
      };
    });

    setCartItems(parsedItems);

    // update checkout url if returned
    const newCheckoutUrl = json?.data?.cart?.checkoutUrl;
    if (newCheckoutUrl) {
      setCheckoutUrl(newCheckoutUrl);
      localStorage.setItem(
        "shopify_cart",
        JSON.stringify({ id, checkoutUrl: newCheckoutUrl })
      );
    }
  }

async function addToCart(product) {
  if (!cartId || !product?.variantId) return;

  const quantity = Number(product.quantity || 1); // ✅ use provided qty

  const res = await fetch(`https://${DOMAIN}/api/2024-04/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({
      query: `
        mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart { id checkoutUrl }
            userErrors { message }
          }
        }
      `,
      variables: {
        cartId,
        lines: [{ merchandiseId: product.variantId, quantity }], // ✅
      },
    }),
  });

  const json = await res.json();
  const newCheckoutUrl = json?.data?.cartLinesAdd?.cart?.checkoutUrl;
  if (newCheckoutUrl) {
    setCheckoutUrl(newCheckoutUrl);
    localStorage.setItem(
      "shopify_cart",
      JSON.stringify({ id: cartId, checkoutUrl: newCheckoutUrl })
    );
  }

  fetchCartLines(cartId);
}


  async function removeFromCart(lineId) {
    if (!cartId || !lineId) return;

    await fetch(`https://${DOMAIN}/api/2024-04/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
      },
      body: JSON.stringify({
        query: `
          mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
            cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
              cart { id checkoutUrl }
              userErrors { message }
            }
          }
        `,
        variables: {
          cartId,
          lineIds: [lineId],
        },
      }),
    });

    fetchCartLines(cartId);
  }

  function addToFavorites(product) {
    const exists = favorites.some((f) => f.variantId === product.variantId);
    if (!exists) {
      const updated = [...favorites, product];
      setFavorites(updated);
      localStorage.setItem("shopify_favorites", JSON.stringify(updated));
    }
  }

  function removeFromFavorites(variantId) {
    const updated = favorites.filter((f) => f.variantId !== variantId);
    setFavorites(updated);
    localStorage.setItem("shopify_favorites", JSON.stringify(updated));
  }

  function moveToCartFromFavorites(product) {
    if (!product?.variantId) return;
    addToCart(product);
    removeFromFavorites(product.variantId);
  }

  return (
    <ShopifyCartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        checkoutUrl,
        favorites,
        addToFavorites,
        removeFromFavorites,
        moveToCartFromFavorites,
      }}
    >
      {children}
    </ShopifyCartContext.Provider>
  );
}

export function useShopifyCart() {
  return useContext(ShopifyCartContext);
}
