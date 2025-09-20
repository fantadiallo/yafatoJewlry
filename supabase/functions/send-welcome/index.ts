/**
 * Supabase Edge Function: send-welcome
 *
 * Sends a welcome email with a discount code to a new newsletter subscriber using the Resend API.
 */

import { Resend } from "npm:resend@2.0.0";

Deno.serve(async (req) => {
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid or missing JSON body", { status: 400 });
  }

  const { email, discount_code } = body;
  if (!email) {
    return new Response("email required", { status: 400 });
  }

  const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
  const from = Deno.env.get("FROM_EMAIL") || "hello@yafato.com";

  const subject =
    discount_code === "SaYafato50#"
      ? "🎉 You got 50% off!"
      : "Welcome to Yafato — here’s your code";

  const text = `Hi,

Thanks for joining the list. Your code: ${discount_code || "YAFATO10la"}

Shop: ${Deno.env.get("SITE_URL") || "https://yafato.com"}
`;

  try {
    const response = await resend.emails.send({
      from,
      to: email,
      subject,
      text,
    });

    console.log("Resend response:", response);

    return new Response("ok", { status: 200 });
  } catch (e) {
    console.error("Error sending email:", e);
    return new Response(`error: ${e?.message || JSON.stringify(e)}`, {
      status: 500,
    });
  }
});
