const express = require("express");
const Url = require("../models/url");

const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  const allUrls = await Url.find({ createdBy: req.user._id });
  res.render("home", {
    urls: allUrls,
  });
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

// Add this route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.redirect("/login");
});

module.exports = router;
