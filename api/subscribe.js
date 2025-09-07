// ESM serverless function (works with "type":"module")
export default function handler(req, res) {
  // CORS (safe defaults)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, apikey");

  // Preflight
  if (req.method === "OPTIONS") return res.status(200).end();

  // Always succeed for GET/POST
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({});
}
