const keys = require("../config/keys");
const passport = require("passport");
const mongoose = require("mongoose");
const userSchema = require("../models/user.schema");
const userModel = mongoose.model("UserModel", userSchema); 
var userDao = require("../models/user.dao");

module.exports = app => {
  app.get("/session", function(req, res) {
    res.json(req.user);
  });

  app.get("/login/spotify-auth", function(req, res) {
    res.redirect("/login/spotify-auth2");
  });

  app.get(
    "/login/spotify-auth2",
    passport.authenticate("spotify", {
      scope: ["user-read-email", "user-read-private"]
    }),
    (req, res) => {
    }
  );

  app.get(
    "/login/spotify-auth/callback",
    passport.authenticate("spotify", { failureRedirect: keys.frontend[0] }),
    (req, res) => {
      res.redirect(keys.frontend[0]);
    }
  );

  app.post("/logout", (req, res) => {
    req.logout();
    res.json({ status: "success" });
  });
  
  app.get("/user/current", (req, res) => {
    if (typeof req.user === "undefined") {
      res.json({
        uid: -1
      });
    } else {
      userDao.findUserByUserId(req.user.profile.id, response => {
        res.json(response);
      });
    }
  });

  app.get("/user/profile/:uid", function(req, res) {
    userModel.findOne({ uid: req.params.uid }).exec(function(err, user) {
      if (err) {
        return res.status(400).send({
          message: "search user error"
        });
      }
      if (!user) {
        return res.status(400).send({
          message: "cannot find user"
        });
      } else {
        if (
          typeof req.user !== "undefined" &&
          req.user.uid === req.params.uid
        ) {
          return res.json(user);
        }
        return res.json({
          uid: -1,
          displayName: user.displayName,
          photo: user.photo,
          country: user.country
        });
      }
    });
  });
};