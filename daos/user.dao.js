const mongoose = require("mongoose");
const userModel = require("../models/user.model");

findAllUsers = () => userModel.find();

findUserById = (userId, callback) => {
  console.log(userId);
  userModel.findOne({ _id: userId }).exec(function(err, user) {
    return callback(err, user)
  });
};

saveUser = (user, callback) => {
  userModel.findOne({ _id: user._id }).exec(function(err, res) {
    if (err) {
      console.log(err);
      return;
    }

    // user not found and will be saved to db
    if (!res) {
      userModel.create(user, (err, userDoc) => {
        if (err) {
          console.log("aaaaa");
          console.log(err);
          return;
        } else {
          console.log("sssss");
          console.log("user saved");
          console.log(userDoc);
          return callback(userDoc);
        }
      });
    }

    // user found in db
    return callback(res);
  });
};

updateUser = (user, res) => {
  console.log(user);
  userModel.updateOne({ _id: user._id }, { $set: user }, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send({ message: "user updated" });
  });
}

module.exports = { findAllUsers, findUserById, saveUser, updateUser };

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
