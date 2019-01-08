/**
 * Defines list model
 */
const mongoose = require('mongoose');

const listSchema = mongoose.Schema({
  name: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
  showDone: { type: mongoose.Schema.Types.Boolean, default: false }
});

module.exports = mongoose.model('List', listSchema);