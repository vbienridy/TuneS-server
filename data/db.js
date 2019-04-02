module.exports = function() {
  const keys = require("../config/keys");
  const mongoose = require("mongoose");
  const databaseName = "tunes";
  const connectionString = keys.mongodb + databaseName;
  mongoose.connect(connectionString, { useNewUrlParser: true });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.once("open", function() {
    console.log("we are connected");
  });
};
