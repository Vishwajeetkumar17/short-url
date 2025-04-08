const shortid = require("shortid");
const Url = require("../models/url");

async function handleGenerateNewShortUrl(req, res) {
  const body = req.body;
  const shortId = shortid();
  if (!body.url) {
    return res.status(400).json({ error: "Url is required" });
  }
  await Url.create({
    shortId: shortId,
    redirectUrl: body.url,
    visitedHistory: [],
  });

  return res.json({
    id: shortId,
  });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await Url.findOne({ shortId: shortId });
  return res.json({
    totalClicks: result.visitedHistory.length,
    Analytics: result.visitedHistory,
  });
}

module.exports = {
  handleGenerateNewShortUrl,
  handleGetAnalytics,
};
