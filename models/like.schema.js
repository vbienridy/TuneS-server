const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    type: String, // SUBJECT or COMMENT
    subject: { type: String, ref: "SubjectModel" }, // subject _id
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "CommentModel" }, // comment _id
    user: { type: String, ref: "UserModel" } // user _id
  },
  {
    collection: "likes",
    timestamps: true
  }
);

module.exports = likeSchema;