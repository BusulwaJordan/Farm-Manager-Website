const express = require('express');
const router = express.Router();
const Feed = require('../models/feed.js');

// Create a new feed entry
router.post('/', async (req, res) => {
  try {
    const feed = new Feed({ ...req.body, userId: req.user.id });
    await feed.save();
    res.status(201).json(feed);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Read all feed entries for the authenticated user
router.get('/', async (req, res) => {
  try {
    const feeds = await Feed.find({ userId: req.user.id });
    res.json(feeds);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a specific feed entry
router.put('/:id', async (req, res) => {
  try {
    const feed = await Feed.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!feed) return res.status(404).json({ msg: 'Feed not found' });
    res.json(feed);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Delete a specific feed entry
router.delete('/:id', async (req, res) => {
  try {
    const feed = await Feed.findByIdAndDelete(req.params.id);
    if (!feed) return res.status(404).json({ msg: 'Feed not found' });
    res.json({ msg: 'Feed deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;