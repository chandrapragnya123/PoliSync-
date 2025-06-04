// backend/routes/complaintRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const Complaint = require('../models/Complaint'); // Adjust path if needed

// Configure multer for memory storage (evidence will be in req.file.buffer)
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/complaint
router.post('/', upload.fields([
    { name: 'complaintData', maxCount: 1 },
    { name: 'evidence', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const rawData = req.body.complaintData;

      if (!rawData) {
        return res.status(400).json({ message: 'Missing complaintData field in request' });
      }

      let complaintData;
      try {
        complaintData = JSON.parse(rawData);
      } catch (parseErr) {
        return res.status(400).json({
          message: 'Invalid JSON in complaintData',
          error: parseErr.message
        });
      }

      const evidenceFile = req.files?.evidence?.[0];
      const evidence = evidenceFile ? {
        originalname: evidenceFile.originalname,
        mimetype: evidenceFile.mimetype,
        buffer: evidenceFile.buffer
      } : null;

      const complaint = new Complaint({
        ...complaintData,
        evidence
      });

      await complaint.save();
      res.status(200).json({ message: 'Complaint submitted successfully' });
    } catch (err) {
      console.error('Complaint save error:', err);
      res.status(500).json({ message: 'Failed to save complaint', error: err.message });
    }
});


module.exports = router;
