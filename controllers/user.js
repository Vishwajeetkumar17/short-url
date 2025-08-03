const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({
      name,
      email,
      password,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.render("signup", { error: "Error in signup" });
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.render("login", { error: "Invalid credentials" });
    }

    const token = setUser(user);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000,
    });

    return res.redirect("/");
  } catch (error) {
    return res.render("login", { error: "Error in login" });
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};
