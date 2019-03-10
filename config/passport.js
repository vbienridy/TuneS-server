const SpotifyStrategy = require("passport-spotify").Strategy;
const keys = require("./keys");
const opts = {};
opts.clientID = keys.spotifyClientID;
opts.clientSecret = keys.spotifyClientSecret;
opts.callbackURL = keys.callBackURL;

module.exports = passport => {
    passport.use(
        new SpotifyStrategy(
            opts,
            (accessToken, refreshToken, expires_in, profile, done) => {
                const payload = {
                    profile: profile,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    expires_in: expires_in
                };
                process.nextTick(function () {
                    return done(null, payload);
                });
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
            }
        )
    );
};