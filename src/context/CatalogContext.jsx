import { createContext, useContext, useEffect, useRef, useState } from "react";

/**
 * @typedef {Object} CatalogContextValue
 * @property {Array<Object>} products - The current list of products in the catalog
 * @property {function} setProducts - Setter function to manually update products
 * @property {boolean} loading - Whether the catalog is currently being loaded
 * @property {Error|null} error - Any error that occurred during loading
 */

/**
 * React Context for the product catalog.
 * Provides product data, loading state, and error info to consumers.
 */
const CatalogContext = createContext({
  products: [],
  setProducts: () => {},
  loading: false,
  error: null,
});

/**
 * CatalogProvider Component
 *
 * Wraps children with a `CatalogContext.Provider` to expose catalog data.
 * Optionally accepts a `loader` function to fetch product data on mount.
 *
 * Features:
 * - Ensures the loader only runs once via `didLoad` ref.
 * - Safely updates state only while the component is mounted (`alive` flag).
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Components that will consume catalog context
 * @param {() => Promise<Array<Object>>} [props.loader] - Optional async loader function for fetching products
 * @returns {JSX.Element} Provider wrapping children
 */
export function CatalogProvider({ children, loader }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(!!loader);
  const [error, setError] = useState(null);
  const didLoad = useRef(false);

  useEffect(() => {
    if (!loader || didLoad.current) return;
    didLoad.current = true;

    let alive = true;
    (async () => {
      try {
        const data = await loader();
        if (alive) setProducts(data || []);
      } catch (e) {
        if (alive) setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [loader]);

  return (
    <CatalogContext.Provider
      value={{ products, setProducts, loading, error }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

/**
 * Hook to consume the CatalogContext.
 *
 * Provides access to:
 * - products
 * - setProducts
 * - loading
 * - error
 *
 * @returns {CatalogContextValue} The current catalog context value
 */
export function useCatalog() {
  return useContext(CatalogContext);
}
