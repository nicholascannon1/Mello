/**
 * Defines the task model
 */
const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  task: String,
  done: Boolean,
});

module.exports = mongoose.model('Task', taskSchema);