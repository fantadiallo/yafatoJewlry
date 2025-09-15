// shopify.js
const DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const API_URL = `https://${DOMAIN}/api/2024-04/graphql.json`;

async function gql(query, variables = {}) {
  const r = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    throw new Error(`HTTP ${r.status}: ${text || r.statusText}`);
  }
  const j = await r.json();
  if (j.errors) throw new Error(JSON.stringify(j.errors));
  return j.data;
}

/* -------------------- Mappers -------------------- */
function mapNodeToItem(node, cursor = null) {
  const v = node?.variants?.edges?.[0]?.node;
  return {
    id: node.id,
    cursor,
    variantId: v?.id || "",
    title: node.title,
    handle: node.handle,
    description: node.description || "",
    image: node.featuredImage?.url || node.images?.edges?.[0]?.node?.url || "",
    price: v?.price?.amount || "",
    currency: v?.price?.currencyCode || "GBP", // fallback GBP
    productType: node.productType || "",
    tags: node.tags || [],
  };
}

function mapProduct(p) {
  if (!p) return null;
  // variants -> rich objects
  const variants = (p.variants?.edges || []).map(({ node }) => ({
    id: node.id,
    title: node.title,
    available: !!node.availableForSale,
    sku: node.sku || "",
    image: node.image?.url || "",
    selectedOptions: node.selectedOptions || [], // [{name, value}]
    price: node.price?.amount || "",
    currency: node.price?.currencyCode || "GBP",
  }));

  // choose a default variant to seed price/currency
  const v0 = variants[0];

  return {
    id: p.id,
    title: p.title,
    description: p.description || "",
    handle: p.handle,
    productType: p.productType || "",
    tags: p.tags || [],
    images: (p.images?.edges || []).map(e => ({
      url: e.node.url,
      alt: e.node.altText || p.title,
    })),
    // keep original quick fields for components that expect them
    variantId: v0?.id || "",
    price: v0?.price || "",
    currency: v0?.currency || "GBP",

    // NEW fields your UI needs:
    options: (p.options || []).map(o => ({
      id: o.id,
      name: o.name,
      values: o.values || [],
    })),
    variants,
  };
}

/* -------------------- Products (array by default) -------------------- */
export async function fetchShopifyProducts(first = 20, after = null) {
  const query = `
    query ($first:Int!, $after:String) {
      products(first:$first, after:$after) {
        edges {
          cursor
          node {
            id
            title
            handle
            description
            productType
            tags
            featuredImage { url altText }
            images(first:1){ edges { node { url } } }
            variants(first:1){ edges { node { id price { amount currencyCode } } } }
          }
        }
        pageInfo { hasNextPage }
      }
    }
  `;
  const d = await gql(query, { first, after });
  const edges = d.products?.edges || [];
  return edges.map(({ node, cursor }) => mapNodeToItem(node, cursor));
}

export async function fetchShopifyProductsPaged(first = 20, after = null) {
  const query = `
    query ($first:Int!, $after:String) {
      products(first:$first, after:$after) {
        edges {
          cursor
          node {
            id
            title
            handle
            description
            productType
            tags
            featuredImage { url altText }
            images(first:1){ edges { node { url } } }
            variants(first:1){ edges { node { id price { amount currencyCode } } } }
          }
        }
        pageInfo { hasNextPage }
      }
    }
  `;
  const d = await gql(query, { first, after });
  const edges = d.products?.edges || [];
  const items = edges.map(({ node, cursor }) => mapNodeToItem(node, cursor));
  return {
    items,
    hasNextPage: d.products?.pageInfo?.hasNextPage || false,
    endCursor: edges.at(-1)?.cursor || null,
  };
}

/* -------------------- Single product (RICH) -------------------- */
export async function fetchSingleProductById(idOrGid) {
  const gid = String(idOrGid).startsWith("gid://shopify/")
    ? String(idOrGid)
    : `gid://shopify/Product/${idOrGid}`;

  const query = `
    query ($id:ID!) {
      node(id:$id) {
        ... on Product {
          id
          title
          description
          handle
          productType
          tags
          images(first: 10) { edges { node { url altText } } }
          options { id name values }
          variants(first: 100) {
            edges {
              node {
                id
                title
                availableForSale
                sku
                image { url }
                selectedOptions { name value }
                price { amount currencyCode }
              }
            }
          }
        }
      }
    }
  `;
  const d = await gql(query, { id: gid });
  const p = d.node;
  if (!p) throw new Error("Product not found");
  return mapProduct(p);
}

export async function fetchProductByHandle(handle) {
  const query = `
    query ($handle:String!) {
      product(handle:$handle) {
        id
        title
        description
        handle
        productType
        tags
        images(first: 10) { edges { node { url altText } } }
        options { id name values }
        variants(first: 100) {
          edges {
            node {
              id
              title
              availableForSale
              sku
              image { url }
              selectedOptions { name value }
              price { amount currencyCode }
            }
          }
        }
      }
    }
  `;
  const d = await gql(query, { handle });
  const p = d.product;
  if (!p) throw new Error("Product not found");
  return mapProduct(p);
}

/* -------------------- Search -------------------- */
function buildShopifyQuery(input) {
  const raw = input?.trim() || "";
  if (!raw) return "";
  const terms = raw.split(/\s+/).slice(0, 6);
  const parts = [`"${raw}"`]
    .concat(terms.map(t => `title:*${t}*`))
    .concat(terms.map(t => `tag:'${t}'`))
    .concat(terms.map(t => `vendor:*${t}*`));
  return parts.join(" OR ");
}

// NOTE: returns an ARRAY (keep as-is for lightweight usage)
export async function searchShopifyProducts(q, first = 20, after = null) {
  const query = `
    query ($q:String!, $first:Int!, $after:String) {
      products(first:$first, after:$after, query:$q) {
        edges {
          cursor
          node {
            id
            title
            handle
            description
            productType
            tags
            featuredImage { url altText }
            images(first:1){ edges { node { url } } }
            variants(first:1){ edges { node { id price { amount currencyCode } } } }
          }
        }
        pageInfo { hasNextPage }
      }
    }
  `;
  const d = await gql(query, { q: buildShopifyQuery(q), first, after });
  const edges = d.products?.edges || [];
  return edges.map(({ node, cursor }) => mapNodeToItem(node, cursor));
}

// Paged helper (object w/ items, hasNextPage, endCursor)
export async function searchShopifyProductsPaged(q, first = 20, after = null) {
  const query = `
    query ($q:String!, $first:Int!, $after:String) {
      products(first:$first, after:$after, query:$q) {
        edges {
          cursor
          node {
            id
            title
            handle
            description
            productType
            tags
            featuredImage { url altText }
            images(first:1){ edges { node { url } } }
            variants(first:1){ edges { node { id price { amount currencyCode } } } }
          }
        }
        pageInfo { hasNextPage }
      }
    }
  `;
  const d = await gql(query, { q: buildShopifyQuery(q), first, after });
  const edges = d.products?.edges || [];
  const items = edges.map(({ node, cursor }) => mapNodeToItem(node, cursor));
  return {
    items,
    hasNextPage: d.products?.pageInfo?.hasNextPage || false,
    endCursor: edges.at(-1)?.cursor || null,
  };
}

/* -------------------- Customer auth -------------------- */
export async function customerLogin(email, password) {
  const mutation = `
    mutation ($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input:$input) {
        customerAccessToken { accessToken expiresAt }
        userErrors { field message }
      }
    }
  `;
  const d = await gql(mutation, { input: { email, password } });
  const out = d.customerAccessTokenCreate;
  if (out?.userErrors?.length) throw new Error(out.userErrors.map(e => e.message).join(", "));
  return out.customerAccessToken;
}

export async function customerLogout(token) {
  const mutation = `
    mutation ($token:String!) {
      customerAccessTokenDelete(customerAccessToken:$token) {
        deletedAccessToken
        deletedCustomerAccessTokenId
        userErrors { message }
      }
    }
  `;
  const d = await gql(mutation, { token });
  if (d.customerAccessTokenDelete?.userErrors?.length)
    throw new Error(d.customerAccessTokenDelete.userErrors.map(e => e.message).join(", "));
  return true;
}

export async function customerRegister({ email, password, firstName = "", lastName = "" }) {
  const mutation = `
    mutation ($input: CustomerCreateInput!) {
      customerCreate(input:$input) {
        customer { id email }
        userErrors { message }
      }
    }
  `;
  const d = await gql(mutation, { input: { email, password, firstName, lastName } });
  const out = d.customerCreate;
  if (out?.userErrors?.length) throw new Error(out.userErrors.map(e => e.message).join(", "));
  return out.customer;
}

export async function customerMe(token) {
  const query = `
    query ($token:String!) {
      customer(customerAccessToken:$token) {
        id
        email
        firstName
        lastName
        orders(first:10) {
          edges {
            node {
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
              totalPriceV2 { amount currencyCode }
            }
          }
        }
      }
    }
  `;
  const d = await gql(query, { token });
  return d.customer || null;
}

/* -------------------- Recommendations -------------------- */
export async function fetchRecommendationsById(productId) {
  const query = `
    query($id: ID!) {
      productRecommendations(productId: $id) {
        id
        title
        handle
        featuredImage { url altText }
        variants(first: 1) {
          edges { node { id price { amount currencyCode } } }
        }
      }
    }
  `;
  const d = await gql(query, { id: productId });
  const list = d.productRecommendations || [];
  return list.map((p) => {
    const v = p.variants?.edges?.[0]?.node;
    return {
      id: p.id,
      handle: p.handle,
      title: p.title,
      image: p.featuredImage?.url || "",
      price: v?.price?.amount || "",
      currency: v?.price?.currencyCode || "GBP",
    };
  });
}

export async function fetchRecommendationsByHandle(handle) {
  const q = `
    query($handle: String!) {
      product(handle: $handle) { id }
    }
  `;
  const d = await gql(q, { handle });
  const id = d.product?.id;
  if (!id) return [];
  return fetchRecommendationsById(id);
}
