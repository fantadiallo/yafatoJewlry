import { useState, useMemo, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext.jsx";
import styles from "./SearchBar.module.scss";
import { searchShopifyProducts } from "../../api/shopify.js";

const norm = (s) => (s || "").toString().toLowerCase().trim();

const rankPrefixThenContains = (list, q) => {
  const needle = norm(q);
  if (!needle) return [];
  const starts = [], contains = [];
  for (const p of list) {
    const title = norm(p.title);
    const handle = norm(p.handle);
    const vendor = norm(p.vendor);
    const tags = norm((p.tags || []).join(" "));
    const hay = `${title} ${handle} ${vendor} ${tags}`;
    if (!hay) continue;
    if (title.startsWith(needle)) starts.push(p);
    else if (hay.includes(needle)) contains.push(p);
  }
  return [...starts, ...contains];
};

export default function SearchBar({ placeholder = "Search products…" }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [remote, setRemote] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { products } = useCatalog(); // already flat from your loader

  const local = useMemo(() => rankPrefixThenContains(products, q).slice(0, 5), [products, q]);

  // If no local hits (or catalog not loaded), fall back to live Shopify search
  useEffect(() => {
    let alive = true;
    const run = async () => {
      const needle = norm(q);
      if (!needle || local.length > 0) { setRemote([]); return; }
      try {
        setLoading(true);
        const items = await searchShopifyProducts(q, 5);
        if (alive) setRemote(items || []);
      } catch {
        if (alive) setRemote([]);
      } finally {
        if (alive) setLoading(false);
      }
    };
    const t = setTimeout(run, 200); // debounce
    return () => { alive = false; clearTimeout(t); };
  }, [q, local.length]);

  const results = local.length ? local : remote;

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
              {loading && <p className={styles.empty}>Searching…</p>}
              {!loading && results.length === 0 && <p className={styles.empty}>No results</p>}
              {!loading && results.map((p) => (
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
              {!loading && results.length > 0 && (
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
