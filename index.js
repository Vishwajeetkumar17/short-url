const express = require("express");
const path = require("path");
const port = 8001 || process.env.PORT;
const urlRouter = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const { connectToMongoDB } = require("./connect");
const Url = require("./models/url");
const app = express();

connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// app.get("/test", async (req, res) => {
//   const allUrl = await Url.find({});
//   return res.render("home",{
//     urls : allUrl,
//   });
// });

app.use("/url", urlRouter);
app.use("/", staticRouter);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await Url.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitedHistory: { timestamp: Date.now() },
      },
    }
  );
  res.redirect(entry.redirectUrl);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
