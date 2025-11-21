require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🏠 Test home: http://localhost:${PORT}/api/anime/home`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log('=================================');
});
