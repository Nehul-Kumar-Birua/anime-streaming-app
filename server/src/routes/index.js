const express = require('express');
const animeRoutes = require('./animeRoutes');

const router = express.Router();

// Mount anime routes
router.use('/anime', animeRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

module.exports = router;
