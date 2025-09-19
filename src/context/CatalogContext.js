// src/context/CatalogContext.js
import { createContext, useContext, useEffect, useRef, useState } from "react";

const CatalogContext = createContext({
  products: [],
  setProducts: () => {},
  loading: false,
  error: null,
});

export function CatalogProvider({ children, loader }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(Boolean(loader));
  const [error, setError] = useState(null);
  const didLoad = useRef(false);

  useEffect(() => {
    if (!loader || didLoad.current) return;
    didLoad.current = true;

    let alive = true;
    (async () => {
      try {
        const data = await loader();
        if (alive) setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        if (alive) setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [loader]);

  return (
    <CatalogContext.Provider value={{ products, setProducts, loading, error }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  return useContext(CatalogContext);
}
