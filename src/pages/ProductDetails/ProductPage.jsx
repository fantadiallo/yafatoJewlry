import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductInfo from '../../components/ProductInfo/ProductInfo';
import ProductGallery from '../../components/ProductGallery/ProductGallery';
import ProductRecommendations from '../../components/ProductRecommendations/ProductRecommendations';
import styles from './ProductPage.module.scss';
import { fetchSingleProductById, fetchShopifyProducts } from '../../api/shopify';
import { useShopifyCart } from '../../context/ShopifyCartContext';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const { addToCart, addToFavorites } = useShopifyCart();

  const placeholder = 'https://via.placeholder.com/600x600?text=No+Image';

  useEffect(() => {
    async function fetchProductData() {
      try {
        const productResult = await fetchSingleProductById(id);
        setProduct(productResult);

        const allProducts = await fetchShopifyProducts();
        const filtered = allProducts.filter((item) => item.id !== id);
        const randomSubset = filtered.slice(0, 4);
        setRecommendations(randomSubset);
      } catch (error) {
        console.error('Failed to load product:', error);
      }
    }

    fetchProductData();
  }, [id]);

  if (!product) return <p className={styles.loading}>Loading product...</p>;

  const galleryImages =
    product.images && product.images.length > 0 ? product.images : [placeholder];

  const productData = {
    id: product.id,
    variantId: product.variants?.[0]?.id,
    title: product.title,
    image: product.images?.[0] || placeholder,
    price: Number(product.variants?.[0]?.price?.amount || 0),
    size: 'One Size',
  };

  return (
    <section className={styles.productPage}>
      <div className={styles.topSection}>
        <ProductGallery images={galleryImages} title={product.title} />

        <ProductInfo
          product={product}
          onAddToCart={() => addToCart(productData)}
          onAddToFavorites={() => addToFavorites(productData)}
        />
      </div>

      {recommendations.length > 0 && (
        <ProductRecommendations products={recommendations} />
      )}
    </section>
  );
}
