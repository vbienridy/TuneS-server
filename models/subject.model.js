const mongoose = require("mongoose");
const subjectSchema = require("./subject.schema");
module.exports = mongoose.model("SubjectModel", subjectSchema);
