
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { email, source } = req.body || {};
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ ok: false, error: "Valid email required" });
    }

    const shop = process.env.SHOPIFY_STORE_DOMAIN;        // e.g. hafaic-7x.myshopify.com
    const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN; // Admin API token (Customers: write)

    // Build the REST payload with DOUBLE OPT-IN (pending until user confirms)
    const payload = {
      customer: {
        email,
        // helpful tags for segmentation in Shopify
        tags: source ? `newsletter,${source}` : "newsletter",
        // DOUBLE OPT-IN here:
        email_marketing_consent: {
          state: "pending",
          opt_in_level: "double_opt_in",
        },
      },
    };

    // Try to create the customer via REST
    const createResp = await fetch(`https://${shop}/admin/api/2024-07/customers.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const createJson = await createResp.json();

    // If the email already exists, upsert consent/tags via GraphQL
    if (createResp.status === 422 && createJson?.errors?.email?.includes("has already been taken")) {
      const upsertQuery = `
        mutation Upsert($input: CustomerInput!) {
          customerUpsert(input: $input) {
            customer { id email }
            userErrors { message }
          }
        }
      `;

      const upsertResp = await fetch(`https://${shop}/admin/api/2024-07/graphql.json`, {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: upsertQuery,
          variables: {
            input: {
              email,
              tags: source ? ["newsletter", source] : ["newsletter"],
              // DOUBLE OPT-IN here too:
              emailMarketingConsent: {
                marketingState: "PENDING",
                marketingOptInLevel: "DOUBLE_OPT_IN",
              },
            },
          },
        }),
      });

      const upsertJson = await upsertResp.json();
      const errs = upsertJson?.data?.customerUpsert?.userErrors;
      if (errs?.length) {
        return res.status(400).json({ ok: false, error: errs[0].message });
      }
      return res.json({ ok: true });
    }

    // If REST create failed for another reason, surface it
    if (!createResp.ok) {
      return res.status(400).json({ ok: false, error: createJson?.errors || createJson });
    }

    // Success
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
