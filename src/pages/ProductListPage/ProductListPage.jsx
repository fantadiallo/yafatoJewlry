import { useEffect, useState } from 'react';
import styles from './ProductListPage.module.scss';
import ProductList from '../../components/ProductsListPage/ProductList';

export default function ProductListPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://your-api.com/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to load products', err));
  }, []);

  return (
    <section className={styles.productListPage}>
      <h2 className={styles.heading}>
        Elevate Your Style with Quality Crafted Pieces
      </h2>

      <ProductList products={products} />

      <p className={styles.count}>{products.length} products</p>
    </section>
  );
}
