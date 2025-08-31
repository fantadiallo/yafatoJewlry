/**
 * Supabase Edge Function: send-welcome
 * Sends a styled welcome email with a discount code via Resend.
 */
import { Resend } from "npm:resend@2.0.0";

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Allow-list your production + dev origins
const ALLOWED_ORIGINS = new Set<string>([
  "https://yafato.com",
  "https://www.yafato.com",
  "https://yafato.netlify.app",
  "http://localhost:5173", // Vite dev
]);

Deno.serve(async (req) => {
  try {
    // CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    // Only allow POST
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: CORS });
    }

    // 🔒 Origin check (allow missing Origin so curl/server-to-server works)
    const origin = req.headers.get("origin") || "";
    const isAllowed = !origin || ALLOWED_ORIGINS.has(origin);
    if (!isAllowed) {
      return new Response("forbidden", { status: 403, headers: CORS });
    }

    const { email, discount_code } = await req.json();
    if (!email) {
      return new Response("email required", { status: 400, headers: CORS });
    }

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const from = Deno.env.get("FROM_EMAIL") || "hello@yafato.com";
    const siteUrl = Deno.env.get("SITE_URL") || "https://yafato.com";

    const subject =
      discount_code === "SaYafato50#"
        ? "🎉 You got 50% off!"
        : "Welcome to Yafato — here’s your code";

    const text = `Hi,
Thanks for joining the list. Your code: ${discount_code || "YAFATO10la"}
Shop: ${siteUrl}
`;

    const html = `
    <div style="font-family: Arial, sans-serif; background:#F8F5F2; padding:20px; color:#111;">
      <div style="max-width:600px; margin:auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
        <img src="${siteUrl}/hero1.png" alt="Welcome to Yafato" style="width:100%; display:block;" />
        <div style="padding:30px; text-align:center;">
          <h1 style="font-size:28px; margin-bottom:16px; color:#111;">Welcome to <span style="color:#E2725B;">Yafato</span></h1>
          <p style="font-size:16px; color:#555; margin-bottom:24px;">We’re excited to have you! Here’s your exclusive discount code:</p>
          <div style="background:#E2725B; color:#fff; font-size:20px; padding:12px 20px; border-radius:8px; display:inline-block; letter-spacing:1px;">
            ${discount_code || "YAFATO10la"}
          </div>
          <p style="margin-top:24px; font-size:14px; color:#777;">
            Shop now at <a href="${siteUrl}" style="color:#E2725B; text-decoration:none;">${siteUrl}</a>
          </p>
        </div>
      </div>
    </div>
    `;

    await resend.emails.send({ from, to: email, subject, text, html });
    return new Response("ok", { status: 200, headers: CORS });
  } catch (e) {
    console.error("send-welcome error:", e);
    return new Response(`error: ${e?.message || e}`, { status: 500, headers: CORS });
  }
});
