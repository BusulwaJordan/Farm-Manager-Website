const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  stock: { type: Number, required: true },
  consumption: [{ animalId: String, amount: Number, date: Date }],
  cost: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feed', feedSchema);