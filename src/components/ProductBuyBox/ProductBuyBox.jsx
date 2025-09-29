import { useMemo, useState } from "react";
import { useShopifyCart } from "../../context/ShopifyCartContext";

/**
 * ProductBuyBox Component
 *
 * Renders a product purchase box with variant selection and an "Add to Cart" button.
 * - Displays product variants (e.g., sizes).
 * - Allows users to select a variant.
 * - Adds the selected variant to the Shopify cart using context.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.product - Shopify product object containing variants.
 * @param {Object} props.product.variants - Connection of product variants.
 * @param {Array<Object>} props.product.variants.edges - List of variant edges.
 * @returns {JSX.Element} The rendered product buy box component.
 */
export default function ProductBuyBox({ product }) {
  const { addToCart } = useShopifyCart();
  const [selectedVariantId, setSelectedVariantId] = useState("");

  /**
   * Memoized array of variants formatted for display.
   *
   * @type {Array<{ id: string, title: string, available: boolean, price: string }>}
   */
  const variants = useMemo(
    () =>
      product?.variants?.edges?.map((e) => ({
        id: e.node.id,
        title: e.node.title,
        available: e.node.availableForSale,
        price: e.node.price?.amount,
      })) || [],
    [product]
  );

  /**
   * Handles adding the selected variant to the cart.
   * If no variant is selected, does nothing.
   */
  function onAdd() {
    if (!selectedVariantId) return;
    addToCart({ variantId: selectedVariantId, quantity: 1 });
  }

  return (
    <div>
      <label htmlFor="variant">Size</label>
      <select
        id="variant"
        value={selectedVariantId}
        onChange={(e) => setSelectedVariantId(e.target.value)}
      >
        <option value="">Select size</option>
        {variants.map((v) => (
          <option key={v.id} value={v.id} disabled={!v.available}>
            {v.title}
          </option>
        ))}
      </select>

      <button
        onClick={onAdd}
        disabled={!selectedVariantId}
        aria-disabled={!selectedVariantId}
      >
        Add to Cart
      </button>
    </div>
  );
}
