const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    _id: String, // spotify id, payload.profile.id
    password: String, // local auth password
    authType: { type: String, enum: ["SPOTIFY", "LOCAL"] },
    displayName: String, // payload.profile.displayName
    email: String, // payload.profile.emails[0].value   ?can be empty
    photo: String, // payload.profile.photos[0]  ?can be empty
    country: String, // payload.profile.country,
    bio: String, // bio string shown on profile page
    type: { type: String, enum: ["MEMBER", "EDITOR"] }
  },
  {
    collection: "users",
    timestamps: true
  }
);

userSchema.methods.validPassword = function(pwd) {
  return this.password === pwd;
};

module.exports = userSchema;