/**
 * Defines the user model
 */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const globals = require('../config/globals');

/**
 * Schema
 */
const userSchema = mongoose.Schema({
  googleId: String,
  name: String,
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List'}]
});

/**
 * Creates a json webtoken for current user
 */
userSchema.methods.getToken = function() {
  return jwt.sign({ id: this._id }, globals.secret, { expiresIn: '7d' });
};

module.exports = mongoose.model('User', userSchema);