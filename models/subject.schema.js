const mongoose = require('mongoose');

// subjectSchema
const subjectSchema = new mongoose.Schema({
  subjectId: String,
  subjectType: String,
  subjectTitle: String,
  subjectPhoto: String
}, { timestamps: true }); // inner timestamps

module.exports = subjectSchema;