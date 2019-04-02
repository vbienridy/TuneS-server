module.exports = function () {
  const keys = require('../config/keys');
  const mongoose = require('mongoose');
  const databaseName = 'tunes';
  var connectionString = keys.mongodb; 
  connectionString += databaseName;
  mongoose.connect(connectionString, { useMongoClient: true, useNewUrlParser: true });

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', function () { console.log('we are connected'); });
};