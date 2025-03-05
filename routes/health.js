const express = require('express');
const router = express.Router();
const Health = require('../models/health.js');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Create a new health record with optional file upload
router.post('/', upload.single('report'), async (req, res) => {
  try {
    const health = new Health({
      ...req.body,
      userId: req.user.id,
      reportUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await health.save();
    res.status(201).json(health);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Read all health records for the authenticated user
router.get('/', async (req, res) => {
  try {
    const healthRecords = await Health.find({ userId: req.user.id });
    res.json(healthRecords);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a specific health record
router.put('/:id', async (req, res) => {
  try {
    const health = await Health.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!health) return res.status(404).json({ msg: 'Health record not found' });
    res.json(health);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Delete a specific health record
router.delete('/:id', async (req, res) => {
  try {
    const health = await Health.findByIdAndDelete(req.params.id);
    if (!health) return res.status(404).json({ msg: 'Health record not found' });
    res.json({ msg: 'Health record deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;