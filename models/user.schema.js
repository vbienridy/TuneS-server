const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    _id: String, // spotify id, payload.profile.id
    displayName: String, // payload.profile.displayName
    email: String, // payload.profile.emails[0].value   ?can be empty
    photo: String, // payload.profile.photos[0]  ?can be empty
    country: String, // payload.profile.country,
    bio: String,
    type: Number // 1 or 2
  },
  { 
    collection: "users", 
    timestamps: true 
  }
);

module.exports = userSchema;