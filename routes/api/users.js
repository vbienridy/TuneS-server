const express = require("express");
const passport = require("passport");
const router = express.Router();

// @route   GET api/users/
// @desc    Tests users route
// @access  Public
router.get("/", (req, res) => res.json({ msg: "Users works" }));

// @route   GET api/users/login
// @desc    Redirect user to spotify auth
// @access  Public
router.get(
  "/login",
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private"]
    // showDialog: true
  }),
  (req, res) => {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
);

// @route   GET api/users/callback
// @desc    callbackURL after user accepts or denies
// @access  Private
router.get(
  "/callback",
  passport.authenticate("spotify", { failureRedirect: "/" }),
  (req, res) => {
    console.log(req.user);
    res.json(req.user);
    // res.json(req.user);
  }
);

// @route   POST api/users/logout
// @desc    log out user
// @access  Private
router.post("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Simple route middleware to ensure user is authenticated.
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

module.exports = router;
