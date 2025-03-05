const express = require('express');
const router = express.Router();
const Financial = require('../models/financial.js');

// Create a new financial entry
router.post('/', async (req, res) => {
  try {
    const financial = new Financial({ ...req.body, userId: req.user.id });
    await financial.save();
    res.status(201).json(financial);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Read all financial entries for the authenticated user
router.get('/', async (req, res) => {
  try {
    const financials = await Financial.find({ userId: req.user.id });
    res.json(financials);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a specific financial entry
router.put('/:id', async (req, res) => {
  try {
    const financial = await Financial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!financial) return res.status(404).json({ msg: 'Financial entry not found' });
    res.json(financial);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Delete a specific financial entry
router.delete('/:id', async (req, res) => {
  try {
    const financial = await Financial.findByIdAndDelete(req.params.id);
    if (!financial) return res.status(404).json({ msg: 'Financial entry not found' });
    res.json({ msg: 'Financial entry deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Generate financial report
router.get('/report', async (req, res) => {
  try {
    const financials = await Financial.find({ userId: req.user.id });
    const totalIncome = financials.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
    const totalExpense = financials.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
    res.json({ totalIncome, totalExpense, profit: totalIncome - totalExpense });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;