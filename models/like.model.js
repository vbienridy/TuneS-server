const mongoose = require("mongoose");
const likeSchema = require("./like.schema");
module.exports = mongoose.model("LikeModel", likeSchema);