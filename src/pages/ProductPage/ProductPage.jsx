import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { fetchShopifyProductsForCards } from "../../api/shopify";
import ProductList from "../../components/ProductsList/ProductList";

/**
 * ProductsPage
 *
 * Displays a list of Shopify products, optionally filtered by type.
 *
 * Features:
 * - Fetches up to 60 products from the Shopify API on mount.
 * - Supports filtering by `type` (via query string, e.g. `/products?type=rings`).
 * - Matches against both `productType` and product `tags`.
 * - Shows loading state and empty-state messages if no products are found.
 * - Delegates rendering to the `ProductList` component.
 *
 * State:
 * - `all` (Array): All fetched products.
 * - `loading` (boolean): Tracks whether products are being fetched.
 *
 * Behavior:
 * - Fetch runs only once on mount (can be extended to refetch when `type` changes).
 * - Memoized filter logic ensures efficient re-renders.
 *
 * @component
 * @returns {JSX.Element} Rendered products list, loading state, or empty state message.
 */
export default function ProductsPage() {
  const { search } = useLocation();
  const type = new URLSearchParams(search).get("type") || ""; // e.g. rings
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch once (or refetch when type changes if desired)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const products = await fetchShopifyProductsForCards(60);
        if (alive) setAll(products || []);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const items = useMemo(() => {
    if (!type) return all;
    const needle = type.toLowerCase().trim();
    return all.filter((p) => {
      const byType = (p.productType || "").toLowerCase() === needle;
      const byTag = (p.tags || []).some((t) => (t || "").toLowerCase() === needle);
      return byType || byTag;
    });
  }, [all, type]);

  if (loading && all.length === 0) return <p style={{ padding: "1rem" }}>Loading…</p>;
  if (!loading && items.length === 0)
    return <p style={{ padding: "1rem" }}>No products found for “{type}”.</p>;

  return <ProductList products={items} />;
}
