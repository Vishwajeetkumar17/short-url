const express = require("express");
const {
  handleGenerateNewShortUrl,
  handleGetAnalytics,
  handleRedirect,
} = require("../controllers/url");
const URL = require("../models/url");
const router = express.Router();

// URL redirection route (place this first)
router.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitedHistory: { timestamp: Date.now() },
        },
      },
      { new: true } // This ensures we get the updated document
    );

    if (!entry) {
      return res.status(404).send("URL not found");
    }

    res.redirect(entry.redirectUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).send("Server error");
  }
});

router.post("/", handleGenerateNewShortUrl);
router.get("/analytics/:shortId", handleGetAnalytics);
router.post("/delete/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  try {
    await URL.findOneAndDelete({ shortId });
    return res.redirect("/");
  } catch (error) {
    console.error("Error deleting URL:", error);
    return res.redirect("/");
  }
});

module.exports = router;
