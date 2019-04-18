const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const likeModel = require("../models/like.model");


findAllUsers = () => userModel.find();

findUserById = (userId, callback) => {
  console.log(userId);
  userModel.findOne({ _id: userId }).exec(function(err, user) {
    return callback(err, user)
  });
};

saveUser = (user, callback) => {
  // only used when spotify oauth, to prevent user type changed
  return userModel.collection.update(
    { _id: user._id, authType: "SPOTIFY" },
    { $setOnInsert: user },
    { upsert: true },
    (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      callback();
    }
  );

  //this is not transcational for dababase, deprecated
  // userModel.findOne({ _id: user._id }).exec(function(err, res) {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   }

  //   // user not found and will be saved to db
  //   if (!res) {
  //     userModel.create(user, (err, userDoc) => {
  //       if (err) {
  //         console.log("aaaaa");
  //         console.log(err);
  //         return;
  //       } else {
  //         console.log("sssss");
  //         console.log("user saved");
  //         console.log(userDoc);
  //         return callback(userDoc);
  //       }
  //     });
  //   }

  //   // user found in db
  //   return callback(res);
  // });
};

register = (user, res) => {
  userModel.findOne({ _id: user._id }).exec(function(err, userDoc) {
    if(err) {
      console.log(err);
      return res.status(500).send({ message: "find user error" });
    }

    if (!userDoc) {
      userModel.create(user, (err, newUserDoc) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ message: "create user error" });
        } else {
          console.log("local user registered");
          console.log(newUserDoc);
          return res.status(200).send(newUserDoc);
        }
      });
    } else {
      return res
        .status(500)
        .send({
          message:
            "The username already exists. Please use a different username."
        });
    }
  });
};

updateUser = (req, res) => {
  if (typeof req.user === "undefined") {
    return res.status(500).send({ message: "no user in session" });
  }
  if (req.user._id !== req.body._id) {
    return res
      .status(500)
      .send({ message: "request user is not user in session" });
  }

  if (req.body.type !== "EDITOR") {
    // if not update to type editor, do not need verification

    // in production, if in session, must be in database
    userModel.updateOne({ _id: req.user._id }, { $set: req.body }, function(
      err
    ) {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send({ message: "user updated" });
    });
  } else {
    likeModel
      .count({ user: req.user._id, type: "SUBJECT" })
      .exec()
      .then(
        count => {
          if (count >= 6) {
            // user veified as experienced user
            userModel.updateOne(
              { _id: req.user._id },
              { $set: req.body },
              function(err) {
                if (err) {
                  return res.status(500).send(err);
                }
                return res.status(200).send({ message: "user updated" });
              }
            );
          } else {
            return res
              .status(500)
              .send("user is not active enough to be editor");
          }
        },
        err => res.status(500).send(err)
      );
  }
};

getUserCount = res => {
  userModel
    .find({ type: "MEMBER" })
    .exec(function(err, users1) {
      if (err) {
        return res.status(500).send(err);
      }
      userModel.find({ type: "EDITOR" }).exec(function(err, users2) {
        if (err) {
          return res.status(500).send(err);
        }
        const userCount = {
          u1: users1.length,
          u2: users2.length
        };
        return res.status(200).send(userCount);
      });
    });
};

module.exports = {
  findAllUsers,
  findUserById,
  saveUser,
  updateUser,
  getUserCount,
  register
};

// const payload = {
//     profile: profile, //profile.id
//     accessToken: accessToken,
//     refreshToken: refreshToken,
//     expires_in: expires_in
// }
// exports.dbSave = (payload, callback) => { //tested
//   let user = {
//     displayName: payload.profile.displayName,
//     sid: payload.profile.id,
//     email: payload.profile.emails.length > 0 ? payload.profile.emails[0].value : "",
//     photo: payload.profile.photos.length > 0 ? payload.profile.photos[0] : "",
//     country: payload.profile.country
//   };//exception here will cause failure of passport?

//   // db.collection.update(
//   //     <query>,
//   //     { $setOnInsert: { <field1>: <value1>, ... } },
//   //     { upsert: true }
//   //  )

//   //https://stackoverflow.com/questions/32430384/mongodb-insert-if-it-doesnt-exist-else-skip
//   return db.collection('users').update({ sid: payload.profile.id }, { $setOnInsert: user },
//     { upsert: true }, (err, res) => { if (err) { return }; callback() })
//   //if found a match, performs update, ignoring setOnInsert
//   //if not found a match:insert by setOnInsert

// }
