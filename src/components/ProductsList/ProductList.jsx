import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.scss';

export default function ProductList({ products }) {
  return (
    <div className={styles.grid}>
      {products.map((product) => {
        console.log('Product:', product);               // ✅ ADD THIS
        console.log('Variants:', product.variants);     // ✅ AND THIS

        return (
<ProductCard
  key={product.id}
  id={product.id}
  variantId={product.variantId}
  image={product.image || 'https://via.placeholder.com/400x400?text=No+Image'}
  title={product.title}
  price={Number(product.price || 0)}
/>
        );
      })}
    </div>
  );
}
