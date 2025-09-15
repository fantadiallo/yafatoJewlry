import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./SearchBar.module.scss";
import { searchShopifyProducts } from "../../api/shopify";

export default function SearchBar({ placeholder = "Search products…" }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // live search
  useEffect(() => {
    let alive = true;
    async function run() {
      if (q.trim().length < 1) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await searchShopifyProducts(q, 5); // limit 5 quick results
        if (!alive) return;
        setResults(Array.isArray(res) ? res : res.items || []);
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => { alive = false; };
  }, [q]);

  function handleClose() {
    setOpen(false);
    setQ("");
    setResults([]);
  }

  return (
    <div className={styles.searchWrapper}>
      {open ? (
        <div className={styles.searchBox}>
          <div className={styles.inputRow}>
            <FiSearch className={styles.leadingIcon} aria-hidden="true" />
            <input
              type="text"
              placeholder={placeholder}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoFocus
              aria-label="Search products"
            />
            <button
              type="button"
              className={styles.closeBtn}
              onClick={handleClose}
              aria-label="Close search"
            >
              <FiX />
            </button>
          </div>

          {/* dropdown results */}
          {q && (
            <div className={styles.dropdown}>
              {loading && <p className={styles.loading}>Searching…</p>}
              {!loading && results.length === 0 && (
                <p className={styles.empty}>No results</p>
              )}
              {results.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.handle}`}
                  className={styles.resultItem}
                  onClick={handleClose}
                >
                  {p.image && (
                    <img src={p.image} alt={p.title} className={styles.thumb} />
                  )}
                  <span>{p.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={styles.iconBtn}
          aria-label="Open search"
        >
          <FiSearch size={22} />
        </button>
      )}
    </div>
  );
}
