
module.exports = (req, res) => {
  if (req.method === 'OPTIONS') return res.status(200).end(); // preflight, just in case
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({}); // pretend success
};
