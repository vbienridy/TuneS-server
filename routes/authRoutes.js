const keys = require("../config/keys");
const passport = require("passport");
const request = require("request");
const querystring = require("querystring");

module.exports = app => {
    app.get("/user/current", (req, res) => {
        if (typeof req.user === 'undefined') {
            console.log('wtf')
            res.json({
                id: -1,
                username: -1
            })
        }
        else {
            User.find({ sid: req.user.profile.id }).exec(function (err, users) {
                if (err)
                    return console.log(err);
                console.log('u', users[0])
                //console.log(users)
                if (users.length > 0) {
                    res.json({ id: req.user.profile.id, username: users[0].displayName })
                }
                else {
                    res.json({
                        id: -1,
                        username: -1
                    })
                }
                // 'athletes' is a list
            })
        }
    })

    app.get('/user/profile/:sid', function (req, res) {
        //console.log(req.user)

        //console.log('id', req.user.profile.id)
        User.find({ sid: req.params.sid }).exec(function (err, users) {
            if (err) {
                return res.status(400).send({
                    message: 'search user error'
                })
            }
            console.log('vvv, users')
            if (users.length === 0) {
                return res.status(400).send({
                    message: 'cannot find user'
                })

            }
            if ((typeof req.user !== 'undefined') && (req.user.sid === req.params.sid)) {
                return res.json(users[0])
            }//only return full profile if it's "me"( in session and it's me who fetched)

            return res.json({
                sid: -1, displayName: users[0].displayName, photo: users[0].photo, country: users[0].country

            })
        }
        )
    })

    //http://www.passportjs.org/docs/authenticate/
    //http://expressjs.com/en/api.html#app.get
    app.get("/session", function (req, res) {
        // console.log(req)
        res.json(req.user)
    })

    app.get("/login/spotify-auth", function (req, res) {
        //req.session.state = "bbb"//you can set redirect album id here
        res.redirect("/login/spotify-auth2")
        // console.log("reded")
    })

    app.get(
        "/login/spotify-auth2",//where spotify comes from?
        passport.authenticate("spotify", { //redirect to spotify
            scope: ["user-read-email", "user-read-private"] //user limits
            // showDialog: true
            //this function is always successful for passport
        }),
        (req, res) => {
            // console.log(req.state)
            // console.log(req.user)
            // console.log("used authRoute get /login/spotify-auth")
            // The request will be redirected to spotify for authentication, so this
            // function will not be called. No? they should be called only on success of previous
        }
    );


    app.get(
        "/login/spotify-auth/callback",
        passport.authenticate("spotify", { failureRedirect: keys.frontend[0] }),//in case of not authorizing
        (req, res) => {//success will execute following, failure does not do these
            //console.log("/login/spotify-auth/callback req func exec")
            //console.log(req.user)
            // console.log(req.session.state)
            res.redirect(keys.frontend[0]);
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

    //     request.post(authOptions, (error, response, body) => {
    //         if (!error && response.statusCode === 200) {
    //             const access_token = body.access_token;
    //             res.send({
    //                 access_token: access_token
    //             });
    //         }
    //     });
    // });

    app.get("/user/current", (req, res) => {
        if (typeof req.user !== 'undefined') {
            res.json({
                id: req.user.profile.id,
                username: req.user.profile.username,
                displayName: req.user.profile.displayName,
                photo: req.user.profile.photos.length !== 0 ? req.user.profile.photos[0] : "https://northmemorial.com/wp-content/uploads/2016/10/PersonPlaceholder.png"
            })
        }
        else {
            res.json({ id: -1, username: -1 })
        }

    });

    app.post("/logout", (req, res) => {
        req.logout();
        res.json({ status: "success" })
        //https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client

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