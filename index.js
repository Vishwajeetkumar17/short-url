require("dotenv").config({ silent: true });

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 8001;
const { restrictToLoggedUserOnly, checkAuth } = require("./middlewares/auth");
const urlRouter = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const userRouter = require("./routes/user");
const { connectToMongoDB } = require("./connect");
const Url = require("./models/url");

const app = express();

connectToMongoDB(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Home route
app.get("/", restrictToLoggedUserOnly, async (req, res) => {
  try {
    const allUrls = await Url.find({ createdBy: req.user._id });
    return res.render("home", {
      urls: allUrls,
    });
  } catch (error) {
    return res.render("home", { error: "Error fetching URLs" });
  }
});

app.use("/url", restrictToLoggedUserOnly, urlRouter);
app.use("/", checkAuth, staticRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
