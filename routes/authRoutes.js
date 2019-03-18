const passport = require("passport");
const request = require("request");
const querystring = require("querystring");
const keys = require("../config/keys");

module.exports = app => {
  app.get(
    "/login/spotify-auth",
    passport.authenticate("spotify", {
      scope: ["user-read-email", "user-read-private"],
      showDialog:true
    }),
    (req, res) => { }
  );

  app.get(
    "/login/spotify-auth/callback",
      passport.authenticate("spotify", { failureRedirect: "https://tunes-app.herokuapp.com/" }),
    (req, res) => {
        res.redirect("https://tunes-app.herokuapp.com/");
      // const options = {
      //     url: "https://api.spotify.com/v1/me",
      //     headers: { Authorization: "Bearer " + req.user.accessToken },
      //     json: true
      // };
      // request.get(options, (error, response, body) => {
      //     console.log(body);
      // });
    }
  );

  app.get("/refresh_token", (req, res) => {
    const refresh_token = req.query.refresh_token; // body-parser
    const authOptions = {
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

  app.get("/user/current", (req, res) => {
    if (req.user) {
      res.json({
        id: req.user.profile.id,
        username: req.user.profile.username
      })
    }
    else {
      res.json({ id: -1, username: -1 })
    }

  });

  app.post("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Simple route middleware to ensure user is authenticated.
  // const ensureAuthenticated = (req, res, next) => {
  //     if (req.isAuthenticated()) {
  //         return next();
  //     }
  //     res.redirect("/");
  // };
}
