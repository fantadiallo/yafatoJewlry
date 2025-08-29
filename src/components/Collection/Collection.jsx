import { useEffect, useState, useRef } from "react";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./Collection.module.scss";
import { fetchShopifyProducts } from "../../api/shopify";

export default function Collection() {
  const [products, setProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  // Fetch Shopify products
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchShopifyProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    loadProducts();
  }, []);

  // Auto-rotate logic (3s interval)
  useEffect(() => {
    if (products.length === 0) return;

    const startRotation = () => {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) =>
          prev === Math.min(products.length, 5) - 1 ? 0 : prev + 1
        );
      }, 3000);
    };

    startRotation();
    return () => clearInterval(intervalRef.current);
  }, [products]);

  // Pause on hover handlers
  const handleMouseEnter = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    if (products.length === 0) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) =>
        prev === Math.min(products.length, 5) - 1 ? 0 : prev + 1
      );
    }, 3000);
  };

  return (
    <section className={styles.sectionCollection}>
      <div className={styles.sectionHeader}>
    <h2>Latest Collection</h2>
    <a href="/products" className={styles.viewAll}>
      View All →
    </a>
    <hr />
  </div>

      <div className={styles.collectionHeroNew}>
        {/* 🔹 Left hero image */}
        <div className={styles.heroLeft}>
          <img src="/fato2.jpg" alt="Gen-Z Jewelry Lifestyle" />
          <div className={styles.heroText}>
            <h2>Latest Collection</h2>
            <p>
            <strong>Gen-Z</strong>crafted
              for a generation doing the inner work, while expressing!
            </p>
            <a href="/products" className={styles.cta}>
              Shop Collection →
            </a>
          </div>
        </div>

        {/* 🔹 Right product showcase with dots */}
        <div
          className={styles.heroRight}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {products.length > 0 && (
            <div className={styles.productShowcase}>
              <div className={styles.productCard}>
                <ProductCard
                  id={products[activeIndex].id}
                  variantId={products[activeIndex].variantId}
                  image={products[activeIndex].image}
                  secondaryImage={products[activeIndex].secondaryImage}
                  title={products[activeIndex].title}
                  price={products[activeIndex].price}
                />
                <div className={styles.overlay}>
                  <a href="/products">Go to Collection →</a>
                </div>
              </div>

              {/* Pagination Dots */}
              <div className={styles.dots}>
                {products.slice(0, 5).map((_, idx) => (
                  <span
                    key={idx}
                    className={`${styles.dot} ${
                      idx === activeIndex ? styles.activeDot : ""
                    }`}
                    onClick={() => setActiveIndex(idx)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
