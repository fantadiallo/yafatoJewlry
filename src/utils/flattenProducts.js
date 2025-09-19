const norm = (s) => (s || "").toString().toLowerCase().trim();

export default function flattenProducts(input) {
  const arr = Array.isArray(input)
    ? input
    : input?.edges?.map((e) => e.node) ||
      input?.nodes ||
      input?.data?.products?.edges?.map((e) => e.node) ||
      input?.data?.products?.nodes ||
      [];

  return arr.map((p) => {
    const node = p.node || p;
    const id = node.id || p.id || "";
    const title = node.title || "";
    const handle =
      node.handle ||
      (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$|--+/g, "-") : "");
    const image =
      node.image ||
      node.featuredImage?.url ||
      node.images?.edges?.[0]?.node?.url ||
      node.media?.edges?.find((m) => m.node?.previewImage)?.node?.previewImage?.url ||
      "";
    const price =
      node.price ??
      node.priceRange?.minVariantPrice?.amount ??
      node.variants?.edges?.[0]?.node?.price?.amount ??
      "";
    const currency =
      node.currency ??
      node.priceRange?.minVariantPrice?.currencyCode ??
      node.variants?.edges?.[0]?.node?.price?.currencyCode ??
      "GBP";
    const vendor = node.vendor || "";
    const tags = Array.isArray(node.tags) ? node.tags : [];
    return { id, title, handle, image, price, currency, vendor, tags };
  });
}

export function searchProducts(list, q) {
  const needle = norm(q);
  if (!needle) return [];
  const starts = [];
  const contains = [];
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
  return [...starts, ...contains].filter((x) => (seen.has(x.id) ? false : (seen.add(x.id), true)));
}
