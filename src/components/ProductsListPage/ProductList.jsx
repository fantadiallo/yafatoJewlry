import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.scss';

export default function ProductList({ products }) {
  return (
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
  );
}
