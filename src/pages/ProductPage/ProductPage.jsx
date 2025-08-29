import { useEffect, useState } from "react";
import ProductList from "../../components/ProductsList/ProductList";
import { fetchShopifyProducts } from "../../api/shopify";
import styles from "./ProductPage.module.scss";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchShopifyProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) {
    return <p className={styles.loading}>Loading products...</p>;
  }

  if (!products.length) {
    return <p className={styles.empty}>No products found.</p>;
  }

  return (
    <main className={styles.productPage}>
      {/* Product Grid */}
      <ProductList products={products} />
    </main>
  );
}
