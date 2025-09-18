import { useEffect, useState } from "react";
import ProductList from "../../components/ProductsList/ProductList";
import { fetchShopifyProductsForCards } from "../../api/shopify";
import styles from "./ProductPage.module.scss";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await fetchShopifyProductsForCards(24);
      setProducts(data || []);
    } catch (e) {
      console.error(e);
      setErr("Couldn’t load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <p className={styles.loading}>Loading products…</p>;
  if (err) return (
    <div className={styles.errorWrap}>
      <p className={styles.error}>{err}</p>
      <button onClick={load} className={styles.retry}>Retry</button>
    </div>
  );
  if (!products.length) return <p className={styles.empty}>No products found.</p>;

  return (
    <main className={styles.productPage}>
      <ProductList products={products} />
    </main>
  );
}

