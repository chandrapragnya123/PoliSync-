// Load environment variables from .env
require('dotenv').config();

// Core modules and libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Import route modules
const authRoutes = require('./routes/authRoutes');
const firRoutes = require('./routes/firRoutes');
const complaintRoutes = require('./routes/complaintRoutes');

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI, {
  
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1); // stop the app if DB fails
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/firs', firRoutes);
app.use('/api/complaints', complaintRoutes);

// Serve static frontend (React build)
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Health check
app.get('/api/test', (req, res) => {
  res.send('Server is running!');
});

// For React Router (catch-all route)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
