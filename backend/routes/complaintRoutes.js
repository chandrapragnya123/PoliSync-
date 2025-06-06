// backend/routes/firRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const FIR = require('../models/FIR'); // ✅ Use FIR model directly
const { auth, USER_ROLES } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

// ---------------------------
// ✅ POST /api/firs - Submit FIR
// ---------------------------
router.post(
  '/',
  auth([USER_ROLES.CITIZEN]),
  upload.fields([
    { name: 'complaintData', maxCount: 1 },
    { name: 'evidence', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      console.log('▶️ Incoming request body:', req.body);
      console.log('▶️ Incoming files:', req.files);

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

      const fir = new FIR({
        ...complaintData,
        evidence,
        createdBy: req.user._id
      });

      await fir.save();
      res.status(200).json({ message: 'FIR submitted successfully' });

    } catch (err) {
      console.error('❌ FIR save error:', err);
      res.status(500).json({ message: 'Failed to save FIR', error: err.message });
    }
  }
);

// ---------------------------
// ✅ GET /api/firs/my - Get FIRs for logged-in citizen
// ---------------------------
router.get('/my', auth([USER_ROLES.CITIZEN]), async (req, res) => {
  try {
    const firs = await FIR.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(firs);
  } catch (err) {
    console.error('Failed to fetch FIRs:', err);
    res.status(500).json({ message: 'Failed to fetch FIRs', error: err.message });
  }
});

module.exports = router;
