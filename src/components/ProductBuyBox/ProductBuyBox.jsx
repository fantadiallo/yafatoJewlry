import { useMemo, useState } from "react";
import { useShopifyCart } from "../../context/ShopifyCartContext";

export default function ProductBuyBox({ product }) {
  const { addToCart } = useShopifyCart();
  const [selectedVariantId, setSelectedVariantId] = useState("");

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
