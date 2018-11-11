/**
 * Database configuration file.
 */
const mongoose = require('mongoose');
const globals = require('./globals');

module.exports.connect = function() {
  mongoose.connect(globals.database.URL, { useNewUrlParser: true });
  mongoose.connection.on('open', () => console.log('Connect to DB'));
}