require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Moved to top with other requires
const app = express();


// Import routes
const authRoutes = require('./routes/authRoutes');
const firRoutes = require('./routes/firRoutes');
const complaintRoutes = require('./routes/complaintRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React frontend
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/firs', firRoutes);
 app.use('/api/complaints', complaintRoutes);

// Simple test route
app.get('/api/test', (req, res) => {
  res.send('Server is running!');
});

// All other GET requests should return the React app
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));