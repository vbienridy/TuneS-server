const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
      follower:{type: String, ref: "UserModel"},
      followee:{type: String, ref: "UserModel"}
  },
  {
    collection: "follows",
    timestamps: true
  }
);

module.exports = followSchema;