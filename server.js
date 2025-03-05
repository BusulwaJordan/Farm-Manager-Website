const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth.js');
const animalRoutes = require('./routes/animal.js');
const feedRoutes = require('./routes/feed.js');
const healthRoutes = require('./routes/health.js');
const taskRoutes = require('./routes/task.js');
const resourceRoutes = require('./routes/resource.js');
const financialRoutes = require('./routes/financial.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

app.use('/api/auth', authRoutes);
app.use('/api/animals', authMiddleware, animalRoutes);
app.use('/api/feed', authMiddleware, feedRoutes);
app.use('/api/health', authMiddleware, healthRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/resources', authMiddleware, resourceRoutes);
app.use('/api/financials', authMiddleware, financialRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));