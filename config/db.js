/**
 * Database configuration file.
 */
const mongoose = require('mongoose');
const globals = require('./globals');

module.exports.connect = function() {
  mongoose.connect(globals.database.URL, {
    useNewUrlParser: true
  });
  mongoose.connection.on('open', () => console.log('Connect to DB'));
  mongoose.connection.on('error', err => {
    console.error(`Mongo Error: ${err}`);
    process.exit(1);
  });
};
