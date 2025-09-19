// ProductsPage.jsx
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { fetchShopifyProductsForCards } from "../../api/shopify";
import ProductList from "../../components/ProductsList/ProductList";

export default function ProductsPage() {
  const { search } = useLocation();
  const type = new URLSearchParams(search).get("type") || ""; // e.g. rings
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch once (or refetch when type changes if you prefer)
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
    return () => { alive = false; };
  }, []);

  const items = useMemo(() => {
    if (!type) return all;
    const needle = type.toLowerCase().trim();
    return all.filter((p) => {
      const byType = (p.productType || "").toLowerCase() === needle;
      const byTag  = (p.tags || []).some(t => (t || "").toLowerCase() === needle);
      return byType || byTag;
    });
  }, [all, type]);

  if (loading && all.length === 0) return <p style={{padding:"1rem"}}>Loading…</p>;
  if (!loading && items.length === 0)
    return <p style={{padding:"1rem"}}>No products found for “{type}”.</p>;

  return <ProductList products={items} />;
}
