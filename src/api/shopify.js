const DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

export async function fetchShopifyProducts() {
  const query = `
    {
      products(first: 20) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            tags
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch(`https://${DOMAIN}/api/2024-04/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();

  return json.data.products.edges.map(({ node }) => {
    const variant = node.variants.edges[0]?.node;
    return {
      id: node.id,
      variantId: variant?.id,
      title: node.title,
      image: node.images.edges[0]?.node.url || '',
      price: variant?.price.amount || '',
      productType: node.productType || '',
      tags: node.tags || [],
    };
  });
}
export async function fetchSingleProductById(id) {
  const globalId = `gid://shopify/Product/${id}`;
  const query = `
    {
      node(id: "${globalId}") {
        ... on Product {
          id
          title
          description
          productType
          tags
          images(first: 5) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch(`https://${DOMAIN}/api/2024-04/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();

  if (!json.data.node) {
    throw new Error('Product not found');
  }

  const node = json.data.node;
  const variant = node.variants.edges[0]?.node;

  return {
    id: node.id,
    variantId: variant?.id,
    title: node.title,
    description: node.description,
    images: node.images.edges.map(edge => edge.node.url),
    price: variant?.price.amount || '',
    productType: node.productType || '',
    tags: node.tags || [],
  };
}

