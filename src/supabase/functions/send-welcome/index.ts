/**
 * Supabase Edge Function: send-welcome
 *
 * Sends a welcome email with a discount code to a new newsletter subscriber using the Resend API.
 *
 * - Expects a POST request with JSON body: { email: string, discount_code?: string }
 * - Uses environment variables:
 *    - RESEND_API_KEY: API key for Resend email service
 *    - FROM_EMAIL: Sender email address (default: hello@yafato.com)
 *    - SITE_URL: The shop/site URL to include in the email
 * - Responds with 200 on success, 400 if email is missing, 500 on error
 *
 * @param {Request} req - The incoming HTTP request
 * @returns {Promise<Response>} - The HTTP response
 */

import { Resend } from "npm:resend@2.0.0";

Deno.serve(async (req) => {
  try {
    const { email, discount_code } = await req.json();
    if (!email) return new Response("email required", { status: 400 });

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const from = Deno.env.get("FROM_EMAIL") || "hello@yafato.com";

    const subject =
      discount_code === "SaYafato50#"
        ? "🎉 You got 50% off!"
        : "Welcome to Yafato — here’s your code";

    const text = `Hi,

Thanks for joining the list. Your code: ${discount_code || "YAFATO10la"}

Shop: ${Deno.env.get("SITE_URL")}
`;

    await resend.emails.send({ from, to: email, subject, text });
    return new Response("ok", { status: 200 });
  } catch (e) {
    return new Response(`error: ${e?.message || e}`, { status: 500 });
  }
});
