const mongoose = require('mongoose');
const subjectSchema = require('./subject.schema');
const subjectModel = mongoose.model('SubjectModel', subjectSchema);
module.exports = subjectModel;