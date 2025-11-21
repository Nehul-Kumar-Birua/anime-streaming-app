const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');

const app = express();

console.log('🚀 Initializing Express app...');

// CORS - MUST be before routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: '🎬 Anime Streaming API',
    version: '1.0.0',
    status: 'running',
    routes: {
      home: '/api/anime/home',
      search: '/api/anime/search?q=naruto',
      health: '/api/health'
    }
  });
});

// API routes
app.use('/api', routes);

// Error handling - MUST be last
app.use(errorHandler);

console.log('✅ Express app initialized');

module.exports = app;
