// Ensure every call to your Supabase domain carries the anon key
const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

try {
  if (typeof window !== "undefined" && window.fetch && SB_URL && SB_KEY) {
    const SB_HOST = new URL(SB_URL).host;
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input, init = {}) => {
      try {
        const urlStr = typeof input === "string" ? input : input?.url;
        if (urlStr) {
          const host = new URL(urlStr, window.location.href).host;
          if (host === SB_HOST) {
            const headers = new Headers(init.headers || {});
            if (!headers.has("apikey")) headers.set("apikey", SB_KEY);
            if (!headers.has("Authorization")) headers.set("Authorization", `Bearer ${SB_KEY}`);
            init = { ...init, headers };
          }
        }
      } catch { /* ignore */ }
      return originalFetch(input, init);
    };
  }
} catch { /* ignore */ }