import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductInfo from '../../components/ProductInfo/ProductInfo';
import styles from './ProductPage.module.scss';
import ProductRecommendations from '../../components/ProductRecommendations/ProductRecommendations';
import ProductGallery from '../../components/ProductGallery/ProductGallery';

export default function ProductPage() {
  const { id } = useParams(); // e.g. /product/1
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const placeholder = 'https://via.placeholder.com/600x600?text=No+Image';

  useEffect(() => {
    async function fetchProductData() {
      try {
        const res = await fetch(`https://your-api.com/products/${id}`);
        const data = await res.json();
        setProduct(data);

        // Optional: fetch related/recommended products
        const recRes = await fetch(`https://your-api.com/products?relatedTo=${id}`);
        const recData = await recRes.json();
        setRecommendations(recData);
      } catch (error) {
        console.error('Failed to load product', error);
      }
    }

    fetchProductData();
  }, [id]);

  if (!product) {
    return <p className={styles.loading}>Loading product...</p>;
  }

  const galleryImages =
    product.images && product.images.length > 0 ? product.images : [placeholder];

  return (
    <section className={styles.productPage}>
      <div className={styles.topSection}>
        <ProductGallery images={galleryImages} title={product.title} />
        <ProductInfo product={product} />
      </div>

      <ProductRecommendations products={recommendations} />
    </section>
  );
}
