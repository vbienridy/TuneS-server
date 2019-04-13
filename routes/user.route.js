const keys = require("../config/keys");
const passport = require("passport");
const userDao = require("../daos/user.dao");

module.exports = app => {
  app.get("/session", function(req, res) {
    res.status(200).send(req.user);
  });

  app.get("/login/spotify-auth", function (req, res) {
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
    console.log("logout");
    req.logout();
    res.status(200).send({ status: "logout success" });
  });

  // get current user profile
  app.get("/user/current", (req, res) => {
    console.log('looking')
    if (typeof req.user === "undefined") {
      return res.status(200).send({
        _id: -1
      });
    } else {
      userDao.findUserById(req.user.profile.id, (err, user) => {
        if (err) {
          return res.status(500).send(err);
        }
        if (!user) {
          console.log("cannot find user");
          return res.status(200).send({ _id: -1 });
        }
        return res.status(200).send(user);
      });
    }
  });

  // get user profile by id
  app.get("/user/:id", function(req, res) {
    userDao.findUserById(req.params.id, (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(200).send({ _id: -1 });
      }
      return res.status(200).send(user);
    });
  });
  
  // update user profile
  app.put("/user/current", function(req, res) {
    userDao.updateUser(req.body, res);
  });

  app.get("/usercount", function(req, res) {
    userDao.getUserCount(res);
  });
};
