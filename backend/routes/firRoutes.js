const express = require('express');
const router = express.Router();
const multer = require('multer');

// Multer setup (move this to the top and define once)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Imports the FIR model and auth middleware
const FIR = require('../models/FIR');
const Complaint = require('../models/Complaint');
const { auth, USER_ROLES } = require('../middleware/auth');

// -----------------------------------------------------------------------------
// Citizen submits FIR (POST /api/firs)
router.post('/', auth([USER_ROLES.CITIZEN]), upload.array('evidenceFiles'), async (req, res) => {
  try {
    const complainant = typeof req.body.complainant === 'string' ? JSON.parse(req.body.complainant) : req.body.complainant;
    const incidentDetails = typeof req.body.incidentDetails === 'string' ? JSON.parse(req.body.incidentDetails) : req.body.incidentDetails;
    const crimeType = typeof req.body.crimeType === 'string' ? JSON.parse(req.body.crimeType) : req.body.crimeType;

    if (!complainant?.fullName || !complainant?.email || !complainant?.phoneNumber)
      return res.status(400).json({ error: 'Complainant details are incomplete' });

    if (!crimeType?.mainCategory)
      return res.status(400).json({ error: 'Crime type mainCategory is required' });

    if (!incidentDetails?.date || !incidentDetails?.description)
      return res.status(400).json({ error: 'Incident details date and description are required' });

    const firData = {
      complainant,
      incidentDetails: {
        ...incidentDetails,
        evidence: [],
      },
      crimeType,
      createdBy: req.user._id,
      status: 'Submitted',
    };

    if (req.files?.length > 0) {
      req.files.forEach(file => {
        let fileType = 'other';
        if (file.mimetype.startsWith('image/')) fileType = 'image';
        else if (file.mimetype.startsWith('video/')) fileType = 'video';
        else if (file.mimetype === 'application/pdf' || file.mimetype.includes('document')) fileType = 'document';

        firData.incidentDetails.evidence.push({
          type: fileType,
          url: file.path,
          description: '',
          uploadedAt: new Date()
        });
      });
    }

    const fir = new FIR(firData);
    await fir.save();

    res.status(201).json({ message: 'FIR submitted successfully', firNumber: fir.firNumber });
  } catch (error) {
    console.error('FIR submission error:', error);
    res.status(400).json({ error: error.message });
  }
});
