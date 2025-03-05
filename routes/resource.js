const express = require('express');
const router = express.Router();
const Resource = require('../models/resource.js');

// Create a new resource
router.post('/', async (req, res) => {
  try {
    const resource = new Resource({ ...req.body, userId: req.user.id });
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Read all resources for the authenticated user
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find({ userId: req.user.id });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a specific resource
router.put('/:id', async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resource) return res.status(404).json({ msg: 'Resource not found' });
    res.json(resource);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Delete a specific resource
router.delete('/:id', async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ msg: 'Resource not found' });
    res.json({ msg: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;