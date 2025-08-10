import { useEffect, useState } from 'react';
import styles from './ProductListPage.module.scss';
import { Link } from 'react-router-dom';
import { fetchShopifyProducts } from '../../api/shopify';
import ProductList from '../../components/ProductsList/ProductList';
const allCollections = ['All', 'Rings', 'Necklaces', 'Bracelets', 'Earrings'];

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchShopifyProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.error('Failed to load products', err));
  }, []);

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const filteredProducts = products.filter((product) => {
    const titleMatch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const collectionMatch =
      selectedCollection === 'All' ||
      product.productType?.toLowerCase() === selectedCollection.toLowerCase() ||
      product.tags?.includes(selectedCollection.toLowerCase());
    return titleMatch && collectionMatch;
  });

  return (
    <section className={styles.productListPage}>
      <Link to="/" className={styles.backLink}>&larr; Back to Home</Link>

      <h2 className={styles.heading}>Elevate Your Style with Quality Crafted Pieces</h2>
      <hr className={styles.divider} />

      <div className={styles.filters}>
        {allCollections.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCollection(cat)}
            className={`${styles.filterBtn} ${selectedCollection === cat ? styles.active : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search products..."
          className={styles.searchInput}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button>
      </div>

      {filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} />
      ) : (
        <p className={styles.empty}>No matching products found.</p>
      )}

      <p className={styles.count}>{filteredProducts.length} product(s)</p>
    </section>
  );
}
