const mongoose = require("mongoose");
const followSchema = require("./follow.schema");
module.exports = mongoose.model("FollowModel", followSchema);