import { useState, useMemo } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";
import flattenProducts, { searchProducts } from "../../utils/flattenProducts";
import styles from "./SearchBar.module.scss";

export default function SearchBar({ placeholder = "Search products…" }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { products } = useCatalog();

  const list = useMemo(() => flattenProducts(products), [products]);
  const results = useMemo(() => searchProducts(list, q).slice(0, 5), [list, q]);

  function handleClose() { setOpen(false); setQ(""); }
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
            <button type="button" className={styles.closeBtn} onClick={handleClose} aria-label="Close search">
              <FiX />
            </button>
          </div>

          {!!q && (
            <div className={styles.dropdown}>
              {results.length === 0 && <p className={styles.empty}>No results</p>}
              {results.map((p) => {
                const path = p.handle ? `/products/${p.handle}` : `/products/${(p.id || "").split("/").pop()}`;
                return (
                  <Link key={p.id || p.handle} to={path} className={styles.resultItem} onClick={handleClose}>
                    {p.image && <img src={p.image} alt={p.title} className={styles.thumb} />}
                    <span>{p.title}</span>
                  </Link>
                );
              })}
              {results.length > 0 && (
                <button type="submit" className={styles.viewAllBtn}>
                  View all results for “{q}”
                </button>
              )}
            </div>
          )}
        </form>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className={styles.iconTrigger} aria-label="Open search">
          <FiSearch size={22} />
        </button>
      )}
    </div>
  );
}
