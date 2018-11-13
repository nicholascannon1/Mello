/**
 * Defines list model
 */
const mongoose = require('mongoose');

const listSchema = mongoose.Schema({
  name: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
});

module.exports = mongoose.model('List', listSchema);