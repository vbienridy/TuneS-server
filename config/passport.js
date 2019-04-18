const SpotifyStrategy = require("passport-spotify").Strategy;
const LocalStrategy = require("passport-local").Strategy;

const keys = require("./keys");
const opts = {
  clientID: keys.spotifyClientID,
  clientSecret: keys.spotifyClientSecret,
  callbackURL: keys.callBackURL
};

const userModel = require("../models/user.model");
const userDao = require('../daos/user.dao');

module.exports = passport => {//
  // spotify auth config
  passport.use(
    new SpotifyStrategy(
      opts,
      (accessToken, refreshToken, expires_in, profile, done) => {
        // const payload = {
        //   profile: profile, //profile.id
        //   accessToken: accessToken,
        //   refreshToken: refreshToken,
        //   expires_in: expires_in
        // };
        // console.log('dbsave', dbSave)
        // dbSave(payload, () => {
        //   done(null, payload)
        // })
        const user = {
          _id: profile.id,
          authType: "SPOTIFY",
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
          type: "MEMBER"
        };

        // console.log(user);
        // console.log('passport.js line43 run')
        userDao.saveUser(user, () => {
          // console.log(userDoc);
          // console.log('doing')
          done(null, user);//after user added to database, user can be in session
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

  // local auth config
  passport.use(
    new LocalStrategy(
      {
        usernameField: "_id",
        passwordField: "password"
      },
      function(username, password, done) {
        userModel.findOne({ _id: username, authType: "LOCAL" }, function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, { message: "Incorrect username." });
          }
          if (!user.validPassword(password)) {
            return done(null, false, { message: "Incorrect password." });
          }
          return done(null, user);
        });
      }
    )
  );
};