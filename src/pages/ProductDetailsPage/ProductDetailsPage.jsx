import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSingleProductById, fetchProductByHandle } from "../../api/shopify";
import ProductGallery from "../../components/ProductGallery/ProductGallery";
import ProductRecommendations from "../../components/ProductRecommendations/ProductRecommendations";
import ProductInfo from "../../components/ProductInfo/ProductInfo";
import styles from "./ProductDetailsPage.module.scss";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const looksLikeHandle = id && !String(id).startsWith("gid://shopify/") && !/^\d+$/.test(String(id));
        const data = looksLikeHandle ? await fetchProductByHandle(id) : await fetchSingleProductById(id);
        if (!alive) return;
        setProduct(data);
      } catch (e) {
        if (!alive) return;
        setErr("Product not found.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [id]);

  if (loading) return <main className="productDetails"><p className="loading">Loading product…</p></main>;
  if (err || !product) return <main className="productDetails"><p className="error">{err || "Product not found."}</p></main>;

  const images = (product.images || []).map((img, i) =>
    typeof img === "string" ? { url: img, alt: `${product.title} ${i + 1}` } : img
  );

  return (
<main className={styles.productDetails}>
  <div className={styles.detailsWrapper}>
    <section className={styles.imageGallery}>
      <ProductGallery images={images} title={product.title} />
    </section>
    <section className={styles.info}>
      <ProductInfo product={product} />
    </section>
  </div>
  <ProductRecommendations productId={product.id} currentId={product.id} />
</main>


  );
}
