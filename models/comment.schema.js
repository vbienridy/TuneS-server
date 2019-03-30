const mongoose = require('mongoose');
const userSchema = require("./user.schema");

// commentSchema
const commentSchema = new mongoose.Schema(
  {
    // user: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
    user: userSchema,
    content: String,
    subjectType: String,
    subjectId: String,
    userLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserModel" }]
  },
  { timestamps: true }
); // inner timestamps
// This will automatically add createdAt and updatedAt fields to your schema.

module.exports = commentSchema;