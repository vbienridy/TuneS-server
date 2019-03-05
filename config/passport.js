const SpotifyStrategy = require("passport-spotify").Strategy;
const keys = require("./keys");
const request = require("request");
const opts = {};
opts.clientID = keys.clientID;
opts.clientSecret = keys.clientSECRET;
opts.callbackURL = keys.callbackURL;

module.exports = passport => {
  passport.use(
    new SpotifyStrategy(
      opts,
      (accessToken, refreshToken, expires_in, profile, done) => {
        // const options = {
        //   url: "https://api.spotify.com/v1/me",
        //   headers: { Authorization: "Bearer " + accessToken },
        //   json: true
        // };

        // use the access token to access the Spotify Web API
        // request.get(options, (error, response, body) => {
        //   console.log(body);
        // });
        const payload = {
          profile: profile,
          accessToken: accessToken,
          refreshToken: refreshToken,
          expires_in: expires_in
        };
        process.nextTick(function() {
          // console.log(accessToken);
          // console.log(refreshToken);
          // console.log(expires_in);
          // console.log(profile);
          return done(null, payload);
          // User.findOrCreate({ spotifyId: profile.id })
          //   .then(user => {
          //     if (user) {
          //       return done(null, user);
          //     }
          //     return done(null, false);
          //   })
          //   .catch(err => {
          //     console.log(err);
          //     return done(err, false);
          //   });
        });
      }
    )
  );
};
