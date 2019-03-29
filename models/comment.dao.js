const mongoose = require('mongoose');
const commentSchema = require('./comment.schema');
const commentModel = mongoose.model('CommentModel', commentSchema);
module.exports = commentModel;