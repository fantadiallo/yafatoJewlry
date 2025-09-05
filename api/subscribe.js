// Minimal neutralizer: always return 200 JSON
module.exports = (req, res) => {
  res.status(200).json({}); // pretend success
};
