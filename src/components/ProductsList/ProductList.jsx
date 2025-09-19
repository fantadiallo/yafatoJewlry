import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductList.module.scss";

export default function ProductList({ products = [] }) {
  return (
    <div className={styles.grid}>
      {products.map((p) => {
        const primaryImage   = p.images?.[0]?.url || "/placeholder.png";
        const secondaryImage = p.images?.[1]?.url || "/placeholder.png";

        return (
          <ProductCard
            key={p.id}
            id={p.id}
            image={primaryImage}
            secondaryImage={secondaryImage}
            title={p.title}
            price={p.price}       // single normalized price
            options={p.options}   // normalized options
            variants={p.variants} // normalized variants
            requireSelection
          />
        );
      })}
    </div>
  );
}
