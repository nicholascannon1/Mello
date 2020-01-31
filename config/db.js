/**
 * Database configuration file.
 */
const mongoose = require('mongoose');
const globals = require('./globals');

module.exports.connect = function() {
  mongoose.connect(globals.database.URL, {
    useNewUrlParser: true
  });
  mongoose.connection.on('open', () => console.log(`Connected to DB ${process.env.DB_URI}`));
  mongoose.connection.on('error', err => {
    console.error(`Mongo Error: ${err}`);
    process.exit(1);
  });
  return mongoose;
};
