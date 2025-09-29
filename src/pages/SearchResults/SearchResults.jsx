import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext.jsx";
import styles from "./SearchResults.module.scss";
import { searchShopifyProducts } from "../../api/shopify.js";

/**
 * Normalize a string to lowercase and trim whitespace.
 * @param {string} s - Input string.
 * @returns {string} Normalized string.
 */
const norm = (s) => (s || "").toString().toLowerCase().trim();

/**
 * Filters a product list by prefix match first, then substring match.
 * Ensures no duplicates.
 *
 * @param {Array<Object>} list - Product list.
 * @param {string} q - Search query.
 * @returns {Array<Object>} Filtered products.
 */
const byPrefixThenContains = (list, q) => {
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
  const seen = new Set();
  return [...starts, ...contains].filter((x) =>
    seen.has(x.id) ? false : (seen.add(x.id), true)
  );
};

/**
 * SearchResults
 *
 * Displays search results for products.
 *
 * Features:
 * - Reads query string parameter `q` for the search term.
 * - Uses local catalog (`useCatalog`) for quick matching.
 * - Falls back to remote API search (`searchShopifyProducts`) if no local results.
 * - Prefix matches are prioritized before substring matches.
 * - Handles loading state and empty state messaging.
 * - Displays results in a grid of product cards with image, title, and price.
 *
 * @component
 * @returns {JSX.Element} Rendered search results page.
 */
export default function SearchResults() {
  const { search } = useLocation();
  const q = new URLSearchParams(search).get("q") || "";
  const { products } = useCatalog();
  const [remote, setRemote] = useState([]);
  const [loading, setLoading] = useState(false);

  const local = useMemo(() => byPrefixThenContains(products, q), [products, q]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [q]);

  useEffect(() => {
    let alive = true;
    async function run() {
      if (local.length > 0) {
        setRemote([]);
        return;
      }
      const needle = norm(q);
      if (!needle) {
        setRemote([]);
        return;
      }
      try {
        setLoading(true);
        const items = await searchShopifyProducts(q, 50);
        if (alive) setRemote(items || []);
      } catch {
        if (alive) setRemote([]);
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, [q, local.length]);

  const items = local.length ? local : remote;

  return (
    <section className={styles.wrap}>
      <header className={styles.header}>
        <h2>
          Search: <span className={styles.query}>“{q}”</span>
          <small className={styles.count}>{items.length}</small>
        </h2>
      </header>

      <div className={styles.body}>
        {loading && <p className={styles.empty}>Searching…</p>}
        {!loading && items.length === 0 && (
          <p className={styles.empty}>No products found.</p>
        )}

        {items.length > 0 && (
          <div className={styles.grid}>
            {items.map((p) => (
              <Link key={p.id} to={`/products/${p.handle}`} className={styles.card}>
                <div className={styles.media}>
                  {p.image ? (
                    <img src={p.image} alt={p.title} />
                  ) : (
                    <div className={styles.placeholder} />
                  )}
                </div>
                <div className={styles.meta}>
                  <h4 className={styles.title}>{p.title}</h4>
                  <p className={styles.price}>
                    {p.price
                      ? `${Number(p.price).toFixed(2)} ${p.currency || "GBP"}`
                      : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
