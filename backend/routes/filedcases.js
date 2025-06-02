const express = require('express');
const multer = require('multer');
const path = require('path');
const Complaint = require('../models/complaint');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// POST route to file a case
router.post('/file', upload.single('evidence'), async (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    incidentDate,
    incidentLocation,
    description
  } = req.body;

  const crimeTypes = Array.isArray(req.body.crimeTypes)
    ? req.body.crimeTypes
    : [req.body.crimeTypes];

  const file = req.file;

  const newComplaint = new Complaint({
    name,
    email,
    phone,
    address,
    crimeTypes,
    incidentDate,
    incidentLocation,
    description,
    evidence: file ? `/uploads/${file.filename}` : null
  });

  try {
    await newComplaint.save();
    console.log('✅ FIR saved:', newComplaint);
    res.json({ message: 'FIR submitted and saved successfully!' });
  } catch (err) {
    console.error('❌ Error saving FIR:', err);
    res.status(500).json({ message: 'Error saving FIR' });
  }
});

module.exports = router;
