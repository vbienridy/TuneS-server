const express = require("express");
const passport = require("passport");
const router = express.Router();
const request = require("request");
const querystring = require("querystring");
const keys = require("../../config/keys");

// @route   GET api/users/
// @desc    Test users route
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
// @desc    Go to callbackURL after user accepts or denies auth
// @access  Private
router.get(
  "/callback",
  passport.authenticate("spotify", { failureRedirect: "/" }),
  (req, res) => {
    const options = {
      url: "https://api.spotify.com/v1/me",
      headers: { Authorization: "Bearer " + req.user.accessToken },
      json: true
    };

    // use the access token to access the Spotify Web API
    request.get(options, (error, response, body) => {
      console.log(body);
    });

    // we can also pass the token to the browser to make requests from there
    res.redirect(
      "/#" +
        querystring.stringify({
          access_token: req.user.accessToken,
          refresh_token: req.user.refreshToken
        })
    );
    // console.log(req.user);
    // res.json(req.user);
  }
);

// @route   POST api/users/refresh_token
// @desc    Refresh access token
// @access  Private
router.get("/refresh_token", (req, res) => {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(keys.clientID + ":" + keys.clientSECRET).toString("base64")
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({
        access_token: access_token
      });
    }
  });
});

// @route   POST api/users/logout
// @desc    Log out user
// @access  Private
router.get("/logout", (req, res) => {
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
