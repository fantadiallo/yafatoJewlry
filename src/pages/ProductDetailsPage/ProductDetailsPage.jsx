import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchSingleProductById, fetchProductByHandle } from "../../api/shopify";
import ProductGallery from "../../components/ProductGallery/ProductGallery";
import ProductRecommendations from "../../components/ProductRecommendations/ProductRecommendations";
import ProductInfo from "../../components/ProductInfo/ProductInfo";
import styles from "./ProductDetailsPage.module.scss";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [search] = useSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const buyRef = useRef(null); // still used for ?select=1 scroll
  const [focusUrl, setFocusUrl] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const looksLikeHandle =
          id && !String(id).startsWith("gid://shopify/") && !/^\d+$/.test(String(id));
        const data = looksLikeHandle
          ? await fetchProductByHandle(id)
          : await fetchSingleProductById(id);
        if (!alive) return;
        setProduct(data);
      } catch {
        if (!alive) return;
        setErr("Product not found.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  // keep the deep-link to options (?select=1)
  useEffect(() => {
    if (search.get("select") && buyRef.current) {
      buyRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [search, product]);

  // optional: set initial focus to the first image on load
  useEffect(() => {
    if (!product?.images?.length) return;
    const first = typeof product.images[0] === "string" ? product.images[0] : product.images[0]?.url;
    if (first) setFocusUrl(first);
  }, [product]);

  if (loading)
    return (
      <main className="productDetails">
        <p className="loading">Loading product…</p>
      </main>
    );
  if (err || !product)
    return (
      <main className="productDetails">
        <p className="error">{err || "Product not found."}</p>
      </main>
    );

  const images = (product.images || []).map((img, i) =>
    typeof img === "string" ? { url: img, alt: `${product.title} ${i + 1}` } : img
  );

  return (
    <main className={styles.productDetails}>
      <div className={styles.detailsWrapper}>
        <section className={styles.imageGallery}>
          <ProductGallery images={images} title={product.title} focusUrl={focusUrl} />
        </section>

        <section className={styles.info}>
          {/* anchor the scroll target to YOUR UI (no duplicate buy box) */}
          <div ref={buyRef}>
            <ProductInfo product={product} onPrimaryImageChange={setFocusUrl} />
          </div>
        </section>
      </div>

      <ProductRecommendations productId={product.id} currentId={product.id} />
    </main>
  );
}
