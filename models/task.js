const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: String },
  dueDate: Date,
  completed: { type: Boolean, default: false },
  recurring: { type: Boolean, default: false },
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);