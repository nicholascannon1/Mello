/**
 * Defines the user model
 */
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  googleId: String,
  name: String
});

module.exports = mongoose.model('User', userSchema);