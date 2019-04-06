const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    _id: String, // spotify subject id
    type: String,
    title: String,
    image: String,
    likeCount: Number
  },
  { 
    collection: 'subjects', 
    timestamps: true 
  }
);

module.exports = subjectSchema;