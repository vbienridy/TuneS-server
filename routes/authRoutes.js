const keys = require("../config/keys");
const passport = require("passport");
const request = require("request");
const querystring = require("querystring");

module.exports = app => {
  // @route   GET api/login/spotify-auth
  // @desc    Redirect user to spotify auth
  // @access  Public

  //http://www.passportjs.org/docs/authenticate/
  //http://expressjs.com/en/api.html#app.get
  app.get("/login/spotify-auth", function (req, res) {
    req.session.state = "bbb"//you can set redirect album id here
    res.redirect("/login/spotify-auth2")
  })
  app.get(
    "/login/spotify-auth2",//where spotify comes from?
    passport.authenticate("spotify", { //redirect to spotify
      scope: ["user-read-email", "user-read-private"] //user limits
      // showDialog: true
      //this function is always successful for passport
    }),
    (req, res) => {
      console.log(req.state);
      console.log(req.user);
      console.log("used authRoute get /login/spotify-auth");
      // The request will be redirected to spotify for authentication, so this
      // function will not be called. No? they should be called only on success of previous
    }
  );

  // @route   GET api/login/spotify-auth/callback
  // @desc    Go to callbackURL after user accepts or denies auth
  // @access  Private
  app.get(
    "/login/spotify-auth/callback",
    passport.authenticate("spotify", { failureRedirect: keys.frontend }), //in case of not authorizing
    (req, res) => {
      //success will execute following, failure does not do these
      console.log("/login/spotify-auth/callback req func exec");
      //console.log(req.user)
      console.log(req.session.state);
      res.redirect(keys.frontend);
      // // options for accessing "https://api.spotify.com/v1/me"
      // const options = {
      //     url: "https://api.spotify.com/v1/me",
      //     headers: { Authorization: "Bearer " + req.user.accessToken },
      //     json: true
      // };
      // // use the access token to access the Spotify Web API
      // request.get(options, (error, response, body) => {
      //     console.log(body);
      // });
    }
  );

  // // @route   GET api/refresh_token
  // // @desc    Refresh access token
  // // @access  Private
  // app.get("/refresh_token", (req, res) => {
  //     // requesting access token from refresh token
  //     const refresh_token = req.query.refresh_token; // body-parser
  //     const authOptions = {
  //         url: "https://accounts.spotify.com/api/token",
  //         headers: {
  //             Authorization:
  //                 "Basic " +
  //                 Buffer.from(keys.clientID + ":" + keys.clientSECRET).toString("base64")
  //         },
  //         form: {
  //             grant_type: "refresh_token",
  //             refresh_token: refresh_token
  //         },
  //         json: true
  //     };

  //     request.post(authOptions, (error, response, body) => {
  //         if (!error && response.statusCode === 200) {
  //             const access_token = body.access_token;
  //             res.send({
  //                 access_token: access_token
  //             });
  //         }
  //     });
  // });

  // @route   GET api/user/current
  // @desc    Retrieve current user
  // @access  Public
  app.get("/user/current", (req, res) => {
    if (typeof req.user !== 'undefined') {
      res.json({
        id: req.user.profile.id,
        username: req.user.profile.username
      })
    }
    else {
      res.json({ id: -1, username: -1 })
    }

  });

  // @route   POST api/logout
  // @desc    Log out user
  // @access  Private
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
    // req.session.destroy(() => res.redirect("/"));
  });

  // Simple route middleware to ensure user is authenticated.
  // const ensureAuthenticated = (req, res, next) => {
  //     if (req.isAuthenticated()) {
  //         return next();
  //     }
  //     res.redirect("/");
  // };
}