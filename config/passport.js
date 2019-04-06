const SpotifyStrategy = require("passport-spotify").Strategy;
const keys = require("./keys");
const opts = {
  clientID: keys.spotifyClientID,
  clientSecret: keys.spotifyClientSecret,
  callbackURL: keys.callBackURL
};
const userDao = require('../daos/user.dao');

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
          _id: profile.id,
          displayName: profile.displayName,
          email:
            profile.emails.length > 0
              ? profile.emails[0].value
              : "",
          photo:
            profile.photos.length > 0
              ? profile.photos[0]
              : "",
          country: profile.country,
          bio: "",
          type: 1
        };

        console.log(user);

        userDao.saveUser(user, userDoc => {
          console.log(userDoc);
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