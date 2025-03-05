const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  species: { type: String, required: true },
  breed: String,
  animalId: { type: String, required: true, unique: true },
  birthDate: Date,
  weight: [{ date: Date, value: Number }],
  group: String,
  milkingRecords: [{ date: Date, quantity: Number }],
  gestation: { status: Boolean, dueDate: Date },
  history: [{ event: String, date: Date }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Animal', animalSchema);