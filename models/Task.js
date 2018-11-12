/**
 * Defines the task model
 */
const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  task: String,
  done: Boolean,
});

module.exports = mongoose.model('Task', taskSchema);