const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: String,
    subject: { type: String, ref: "SubjectModel" }, // subject _id
    user: { type: String, ref: "UserModel" }, // user _id
    likeCount: Number
  },
  {
    collection: "comments",
    timestamps: true
  }
);

module.exports = commentSchema;
