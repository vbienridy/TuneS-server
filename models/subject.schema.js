const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    _id: String, // spotify subject id
    type: String,
    title: String,
    image: String,
    likeCount: Number,
    intro: String, // album or artist intro
    lyric: String // track lyric
  },
  {
    collection: "subjects",
    timestamps: true
  }
);

module.exports = subjectSchema;
