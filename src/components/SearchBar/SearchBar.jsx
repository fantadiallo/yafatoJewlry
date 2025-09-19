// SearchBar.jsx
import { useState, useMemo } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SearchBar.module.scss";

export default function SearchBar({ products = [], placeholder = "Search products…" }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const norm = (s) => (s || "").toString().toLowerCase().trim();
  const results = useMemo(() => {
    const needle = norm(q);
    if (!needle) return [];
    return products
      .filter((p) => {
        const title = norm(p.title);
        const handle = norm(p.handle);
        const vendor = norm(p.vendor);
        const tags = Array.isArray(p.tags) ? norm(p.tags.join(" ")) : "";
        return (
          title.startsWith(needle) ||
          title.includes(needle) ||
          handle.includes(needle) ||
          vendor.includes(needle) ||
          tags.includes(needle)
        );
      })
      .slice(0, 5);
  }, [q, products]);

  function handleClose() {
    setOpen(false);
    setQ("");
  }

  function goToResults(e) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    handleClose();
  }

  return (
    <div className={styles.searchWrapper}>
      {open ? (
        <form className={styles.searchForm} onSubmit={goToResults}>
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

          {!!q && (
            <div className={styles.dropdown}>
              {results.length === 0 && <p className={styles.empty}>No results</p>}
              {results.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.handle}`}
                  className={styles.resultItem}
                  onClick={handleClose}
                >
                  {p.image && <img src={p.image} alt={p.title} className={styles.thumb} />}
                  <span>{p.title}</span>
                </Link>
              ))}
              {results.length > 0 && (
                <button type="submit" className={styles.viewAllBtn}>
                  View all results for “{q}”
                </button>
              )}
            </div>
          )}
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={styles.iconTrigger}
          aria-label="Open search"
        >
          <FiSearch size={22} />
        </button>
      )}
    </div>
  );
}
