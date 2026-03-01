import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import styles from "./ProductPage.module.scss";
import { fetchShopifyProductsForCards } from "../../api/shopify";
import ProductList from "../../components/ProductsList/ProductList";

export default function ProductsPage() {
  const { search } = useLocation();
  const type = new URLSearchParams(search).get("type") || "";

  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState("newest");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const products = await fetchShopifyProductsForCards(60);
        if (alive) setAll(products || []);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const toggleInArray = (arr, value) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedCollections([]);
  };

  const categories = useMemo(() => {
    const set = new Set();
    (all || []).forEach((p) => {
      if (p?.productType) set.add(p.productType);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [all]);

  const collections = useMemo(() => {
    const set = new Set();
    (all || []).forEach((p) => {
      (p?.tags || []).forEach((t) => {
        if (t) set.add(t);
      });
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [all]);

  const items = useMemo(() => {
    let list = all;

    if (type) {
      const needle = type.toLowerCase().trim();
      list = list.filter((p) => {
        const byType = (p.productType || "").toLowerCase() === needle;
        const byTag = (p.tags || []).some((t) => (t || "").toLowerCase() === needle);
        return byType || byTag;
      });
    }

    if (selectedCategories.length) {
      list = list.filter((p) => selectedCategories.includes(p.productType));
    }

    if (selectedCollections.length) {
      list = list.filter((p) =>
        (p.tags || []).some((t) => selectedCollections.includes(t))
      );
    }

    return list;
  }, [all, type, selectedCategories, selectedCollections]);

  const sortedItems = useMemo(() => {
    const arr = (items || []).slice();

    if (sort === "newest") {
      arr.sort((a, b) => {
        const da = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      });
      return arr;
    }

    if (sort === "price-asc") {
      arr.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
    }

    if (sort === "price-desc") {
      arr.sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0));
    }

    if (sort === "title") {
      arr.sort((a, b) => String(a?.title || "").localeCompare(String(b?.title || "")));
    }

    return arr;
  }, [items, sort]);

  const activeCount = selectedCategories.length + selectedCollections.length;

  if (loading && all.length === 0) return <p className={styles.state}>Loading…</p>;
  if (!loading && items.length === 0)
    return <p className={styles.state}>No products found{type ? ` for “${type}”` : ""}.</p>;

  return (
    <section className={styles.page}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.filtersBtn}
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((v) => !v)}
        >
          <span className={styles.filtersIcon} aria-hidden="true">
            ⎯⎯
          </span>
          <span>Filters</span>
          {activeCount > 0 && <span className={styles.filterPill}>{activeCount}</span>}
        </button>

        <div className={styles.sortWrap}>
          <span className={styles.sortLabel}>Sort by</span>
          <select
            className={styles.sortSelect}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
          >
            <option value="newest">Newest</option>
            <option value="featured">Featured</option>
            <option value="title">Name</option>
            <option value="price-asc">Price (low)</option>
            <option value="price-desc">Price (high)</option>
          </select>
        </div>
      </div>

      {filtersOpen && (
        <div className={styles.filtersPanel} role="region" aria-label="Filters panel">
          <div className={styles.filtersInner}>
            <div className={styles.filtersHeader}>
              <div className={styles.filtersTitle}>Refine</div>
              <button
                type="button"
                className={styles.clearBtn}
                onClick={clearFilters}
                disabled={activeCount === 0}
              >
                Clear
              </button>
            </div>

            <div className={styles.filtersGroup}>
              <div className={styles.groupTitle}>Category</div>
              <div className={styles.optionsGrid}>
                {categories.map((c) => (
                  <label key={c} className={styles.option}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(c)}
                      onChange={() =>
                        setSelectedCategories((prev) => toggleInArray(prev, c))
                      }
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filtersGroup}>
              <div className={styles.groupTitle}>Collection</div>
              <div className={styles.optionsGrid}>
                {collections.map((t) => (
                  <label key={t} className={styles.option}>
                    <input
                      type="checkbox"
                      checked={selectedCollections.includes(t)}
                      onChange={() =>
                        setSelectedCollections((prev) => toggleInArray(prev, t))
                      }
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filtersFooter}>
              <button
                type="button"
                className={styles.closeFilters}
                onClick={() => setFiltersOpen(false)}
              >
                View results ({items.length})
              </button>
            </div>
          </div>
        </div>
      )}

      <ProductList products={sortedItems} />
    </section>
  );
}
