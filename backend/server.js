require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');

const app = express();

// Connect to MongoDB first
connectDB()
  .then(() => {
    // Middleware
    app.use(cors());
    app.use(express.json());

    // Serve static files from uploads directory
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // Routes
    const submitRoutes = require('./routes/submitRoute');
    app.use('/submit', submitRoutes);

    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', mongo: !!process.env.MONGODB_URI });
    });

    app.get('/', (req, res) => {
      res.send('🎓 Research Portal Backend Running');
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });