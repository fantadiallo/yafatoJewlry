import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": Deno.env.get("SITE_ORIGIN") || "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_KEY   = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL   = Deno.env.get("FROM_EMAIL") || "Yafato <hello@yafato.com>";
const SITE_URL     = Deno.env.get("SITE_URL") || "https://yafato.com";
const EMAILS_ENABLED = (Deno.env.get("WELCOME_EMAILS_ENABLED") || "false").toLowerCase() === "true";

const sb = createClient(SUPABASE_URL, SERVICE_KEY);
const resend = new Resend(RESEND_KEY);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: cors });

  let body: any;
  try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: "Invalid or missing JSON body" }), { status: 400, headers: cors }); }

  const email = String(body?.email || "").trim().toLowerCase();
  const rawCode = String(body?.discount_code || "").trim().toUpperCase();
  const code = rawCode || "YAFATO10";
  if (!email) return new Response(JSON.stringify({ error: "email required" }), { status: 400, headers: cors });

  // Find subscriber
  const { data: rows, error } = await sb
    .from("newsletter_subscribers")
    .select("id, welcome_sent_at, discount_code")
    .eq("email", email)
    .limit(1);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: cors });

  const row = rows?.[0];

  // If already sent, skip (idempotent)
  if (row?.welcome_sent_at) {
    return new Response(JSON.stringify({ ok: true, skipped: "already_sent" }), { status: 200, headers: cors });
  }

  if (!EMAILS_ENABLED) {
    return new Response(JSON.stringify({ ok: true, skipped: "disabled" }), { status: 200, headers: cors });
  }

  const subject = code === "SAYAFATO50" ? "🎉 You got 50% off!" : "Welcome to Yafato — here’s your 10% code";
  const text = `Welcome to Yafato!\nYour code: ${code}\nShop: ${SITE_URL}\n`;
  const html = `
    <div style="font-family: 'Sen', Arial, sans-serif; background:#F8F5F2; padding:20px; color:#111;">
      <div style="max-width:600px; margin:auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
        <img src="${SITE_URL}/hero1.png" alt="Welcome to Yafato" style="width:100%; display:block;" />
        <div style="padding:30px; text-align:center;">
          <h1 style="font-family:'Cormorant Garamond', serif; font-size:28px; margin-bottom:16px; color:#111;">
            Welcome to <span style="color:#37697d;">Yafato</span>
          </h1>
          <p style="font-size:16px; color:#555; margin-bottom:24px;">We’re excited to have you! Here’s your exclusive discount code:</p>
          <div style="background:#37697d; color:#fff; font-size:20px; padding:12px 20px; border-radius:8px; display:inline-block; letter-spacing:1px;">${code}</div>
          <p style="margin-top:24px; font-size:14px; color:#777;">Shop now at <a href="${SITE_URL}" style="color:#37697d; text-decoration:none;">${SITE_URL}</a></p>
        </div>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({ from: FROM_EMAIL, to: email, subject, text, html });
    if (row) {
      await sb.from("newsletter_subscribers").update({ welcome_sent_at: new Date().toISOString() }).eq("id", row.id);
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), { status: 500, headers: cors });
  }
});
