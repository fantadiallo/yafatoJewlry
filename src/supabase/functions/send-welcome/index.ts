/**
 * Supabase Edge Function: send-welcome
 *
 * Sends a styled welcome email with a discount code + hero image using Resend API.
 */

import { Resend } from "npm:resend@2.0.0";

Deno.serve(async (req) => {
  try {
    const { email, discount_code } = await req.json();
    if (!email) return new Response("email required", { status: 400 });

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const from = Deno.env.get("FROM_EMAIL") || "hello@yafato.com";
    const siteUrl = Deno.env.get("SITE_URL") || "https://yafato.com";

    const subject =
      discount_code === "SaYafato50#"
        ? "🎉 You got 50% off!"
        : "Welcome to Yafato — here’s your code";

    // Plaintext fallback (for clients that don’t support HTML)
    const text = `Hi,
Thanks for joining the list. Your code: ${discount_code || "YAFATO10la"}
Shop: ${siteUrl}
`;

    // Styled HTML with image
    const html = `
    <div style="font-family: 'Sen', Arial, sans-serif; background:#F8F5F2; padding:20px; color:#111;">
      <div style="max-width:600px; margin:auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
        
        <img src="${siteUrl}/hero1.png" alt="Welcome to Yafato" style="width:100%; display:block;" />

        <div style="padding:30px; text-align:center;">
          <h1 style="font-family:'Cormorant Garamond', serif; font-size:28px; margin-bottom:16px; color:#111;">
            Welcome to <span style="color:#E2725B;">Yafato</span>
          </h1>
          <p style="font-size:16px; color:#555; margin-bottom:24px;">
            We're excited to have you! Here’s your exclusive discount code:
          </p>
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

    await resend.emails.send({
      from,
      to: email,
      subject,
      text,
      html,
    });

    return new Response("ok", { status: 200 });
  } catch (e) {
    return new Response(`error: ${e?.message || e}`, { status: 500 });
  }
});
