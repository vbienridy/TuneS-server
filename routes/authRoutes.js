const passport = require("passport");
const request = require("request");
const querystring = require("querystring");
const keys = require("../config/keys");

module.exports = app => {
    // @route   GET api/users/login
    // @desc    Redirect user to spotify auth
    // @access  Public
    app.get(
        "/login/spotify-auth",
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
    app.get(
        "/login/spotify-auth/callback",
        passport.authenticate("spotify", { failureRedirect: "/" }),
        (req, res) => {
            res.json(req.user);
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

    // // @route   GET api/users/refresh_token
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

    // @route   POST api/users/logout
    // @desc    Log out user
    // @access  Private
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
