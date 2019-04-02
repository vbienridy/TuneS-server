const mongoose = require("mongoose");
const commentSchema = require("./comment.schema");
module.exports = mongoose.model("CommentModel", commentSchema);
