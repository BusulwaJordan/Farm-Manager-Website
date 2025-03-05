const mongoose = require('mongoose');

const financialSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  description: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Financial', financialSchema);