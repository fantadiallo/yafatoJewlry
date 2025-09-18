import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.scss';

export default function ProductList({ products }) {
  return (
    <div className={styles.grid}>
      {products.map((product) => {
        console.log('Product:', product);
        console.log('Variants:', product.variants);

        return (
          <ProductCard
            key={product.id} // ✅ important for list rendering
            id={product.id}
            image={product.featuredImage?.url}
            secondaryImage={product.images?.edges?.[1]?.node?.url}
            title={product.title}
            price={product.priceRange?.minVariantPrice?.amount}
            options={product.options?.map((o) => ({
              name: o.name,
              values: o.values,
            })) || []}
            variants={product.variants?.edges?.map((e) => e.node) || []}
            requireSelection
          />
        );
      })}
    </div>
  );
}
