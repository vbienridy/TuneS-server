const mongoose = require('mongoose');
const userSchema = require('./user.schema');
const userModel = mongoose.model('UserModel', userSchema);

findAllUsers = () =>
  userModel.find();

findUserByUserId = (uid, callback) => {
  userModel.findOne({ uid: uid }).populate("comments").populate("commentLikes").exec(function (err, user) {
    if (err) {
      return console.log(err);
    }

    if (user) {
      return callback({
        uid: uid,
        displayName: user.displayName,
        photo: user.photo
      });
    } else {
      return callback({
        uid: -1,
        displayName: -1,
        photo: -1
      });
    }
  });
};

saveUser = (user, callback) => {
  userModel.findOne({ uid: user.uid }).exec(function (err, res) {
    if (err) {
      return console.log(err);
    }
    if (!res) {
      console.log("user saved");
      userModel.create(user, (err, userDoc) => {
        if (err) {
          console.log(err);
        } else {
          console.log(userDoc);
          return callback();
        }
      });
    }
    return callback();
  });

}

updateUser = (uid, user) => userModel.update({ uid: uid }, { $set: user });

module.exports = { userModel, findAllUsers, findUserByUserId, saveUser, updateUser };




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