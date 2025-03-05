const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  maintenanceDate: Date,
  waterUsage: { amount: Number, date: Date },
  pastureArea: { size: Number, unit: String },
  cost: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resource', resourceSchema);