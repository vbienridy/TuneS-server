const SpotifyStrategy = require("passport-spotify").Strategy;
const keys = require("./keys");
const opts = {};
opts.clientID = keys.spotifyClientID;
opts.clientSecret = keys.spotifyClientSecret;
opts.callbackURL = keys.callBackURL; //callback url from dev
// const dbSave = require("../data/db").dbSave;
const userDao = require('../models/user.dao');

module.exports = passport => {//
  //spotify
  passport.use(
    new SpotifyStrategy(
      opts,
      (accessToken, refreshToken, expires_in, profile, done) => {
        const payload = {
          profile: profile, //profile.id
          accessToken: accessToken,
          refreshToken: refreshToken,
          expires_in: expires_in
        };
        // console.log('dbsave', dbSave)
        // dbSave(payload, () => {
        //   done(null, payload)
        // })
        const user = {
            uid: payload.profile.id,
            displayName: payload.profile.displayName,
            email:
              payload.profile.emails.length > 0
                ? payload.profile.emails[0].value
                : "",
            photo:
              payload.profile.photos.length > 0
                ? payload.profile.photos[0]
                : "",
            country: payload.profile.country
          };
          console.log(user);
        userDao.saveUser(user, () => {
          done(null, payload);
        });

        // process.nextTick(function () { //change for database
        //     return done(null, payload);
        // });
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