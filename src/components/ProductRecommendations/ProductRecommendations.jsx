
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductRecommendations.module.scss';

export default function ProductRecommendations({ products }) {
  if (!products?.length) return null;

  return (
    <section className={styles.recommendations}>
      <h2 className={styles.heading}>You may also like</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={product.image}
            title={product.title}
            price={product.price}
            oldPrice={product.oldPrice}
            discount={product.discount}
          />
        ))}
      </div>
    </section>
  );
}
