const express = require('express');
const router = express.Router();
const Animal = require('../models/animal.js');
const { Parser } = require('json2csv');

router.post('/', async (req, res) => {
  const animal = new Animal({ ...req.body, userId: req.user.id });
  await animal.save();
  res.status(201).json(animal);
});

router.get('/', async (req, res) => {
  const { species } = req.query;
  const query = species ? { userId: req.user.id, species } : { userId: req.user.id };
  const animals = await Animal.find(query);
  res.json(animals);
});

router.put('/:id', async (req, res) => {
  const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(animal);
});

router.delete('/:id', async (req, res) => {
  await Animal.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Animal deleted' });
});

router.get('/export', async (req, res) => {
  const animals = await Animal.find({ userId: req.user.id });
  const parser = new Parser();
  const csv = parser.parse(animals);
  res.header('Content-Type', 'text/csv');
  res.attachment('animals.csv');
  res.send(csv);
});

module.exports = router;