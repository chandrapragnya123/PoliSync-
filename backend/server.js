// Load environment variables from .env
require('dotenv').config();

// Core modules and libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// In your main server.js or app.js
app.use('/uploads', express.static('uploads'));

// ------------------------------------
// ✅ Middleware
// ------------------------------------
app.use(cors());

// Handle preflight requests
app.options('*', cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------------------------
// ✅ MongoDB connection
// ------------------------------------
mongoose.connect(process.env.MONGODB_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection failed:', err));

// ------------------------------------
// ✅ Routes
// ------------------------------------
const authRoutes = require('./routes/authRoutes');
const firRoutes = require('./routes/firRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const filedCasesRoute = require('./routes/filedcases');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/firs', firRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/complaints', filedCasesRoute); // Make sure this does not conflict

// Test route
app.get('/api/test', (req, res) => {
  res.send('✅ Server is running!');
});

// ------------------------------------
// ✅ Serve React frontend (Production)
// ------------------------------------
const frontendPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ------------------------------------
// ✅ Start server
// ------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
