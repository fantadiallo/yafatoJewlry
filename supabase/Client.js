import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key, {
  global: {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    // TEMP: log outgoing requests once in prod to verify headers (remove later)
    fetch: (input, init) => {
      try {
        if (typeof input === "string" && input.includes("/rest/v1/rpc/subscribe_newsletter")) {
          // You should see 'authorization' and 'apikey' in here
          console.log("RPC request headers ->", init?.headers);
        }
      } catch {}
      return fetch(input, init);
    },
  },
});

// dev-only logs
if (import.meta.env.DEV) {
  console.log("Supabase URL:", url);
  console.log("Anon key exists?", !!key);
}
