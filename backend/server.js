require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/polisync', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection failed:', err));

// Route imports
const authRoutes = require('./routes/authRoutes');
const firRoutes = require('./routes/firRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const filedCasesRoute = require('./routes/filedcases');

// Route registration
app.use('/api/auth', authRoutes);
app.use('/api/firs', firRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/complaints', filedCasesRoute); // If needed, adjust to avoid duplicate paths

// Simple test route
app.get('/api/test', (req, res) => {
  res.send('Server is running!');
});

// Serve React frontend in production
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
