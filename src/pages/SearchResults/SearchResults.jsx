import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { searchShopifyProducts } from "../../api/shopify";

export default function SearchResults() {
  const { search } = useLocation();
  const q = new URLSearchParams(search).get("q") || "";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(false);

  async function load(next) {
    setLoading(true);
    try {
      const res = await searchShopifyProducts(q, 20, next || null);
      setItems(next ? [...items, ...res.items] : res.items);
      setHasNext(res.hasNextPage);
      setCursor(res.endCursor);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (q) load(); }, [q]);

  return (
    <section style={{maxWidth:1200,margin:"0 auto",padding:"1.25rem"}}>
      <h2 style={{margin:"0 0 .75rem"}}>Search: {q}</h2>
      {loading && items.length===0 && <p>Loading…</p>}
      {!loading && items.length===0 && <p>No products found.</p>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"1rem"}}>
        {items.map(p => (
          <Link key={p.id} to={`/products/${p.handle}`} style={{textDecoration:"none",color:"inherit",border:"1px solid #eee",borderRadius:12,padding:12,background:"#fff"}}>
            {p.image && (
              <img
                src={p.image}
                alt={p.title}
                style={{width:"100%",height:220,objectFit:"cover",borderRadius:8,background:"#F8F5F2"}}
              />
            )}
            <h4 style={{margin:"8px 0"}}>{p.title}</h4>
            <p style={{opacity:.7,margin:0}}>
              {p.price ? `${Number(p.price).toFixed(2)} ${p.currency||"GBP"}` : ""}
            </p>
          </Link>
        ))}
      </div>
      {hasNext && (
        <div style={{display:"flex",justifyContent:"center",marginTop:"1rem"}}>
          <button onClick={() => load(cursor)} style={{padding:".7rem 1rem",borderRadius:10,border:"1px solid #ddd",background:"#fff",cursor:"pointer"}}>
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}
