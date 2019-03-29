const mongoose = require('mongoose');

// userSchema
const userSchema = new mongoose.Schema(
  {
    uid: String, // spotify id, payload.profile.id
    displayName: String, // payload.profile.displayName
    email: String, // payload.profile.emails[0].value   ?can be empty
    photo: String, // payload.profile.photos[0]  ?can be empty
    country: String, // payload.profile.country
    subjectLikes: [{ subjectType: String, subjectId: String }],
    commentLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "CommentModel" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "CommentModel" }]
  },
  { timestamps: true }
); // inner timestamps

module.exports = userSchema;