const mongoose = require('mongoose');

const healthSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  animalId: { type: String, required: true },
  vetVisitDate: Date,
  vaccination: { type: String, date: Date },
  medication: [{ name: String, date: Date, dosage: String }],
  illness: { type: String, date: Date, status: String },
  reminder: { type: Date, message: String },
  reportUrl: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Health', healthSchema);