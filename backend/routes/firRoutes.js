const express = require('express');
const router = express.Router();
const multer = require('multer');
const FIR = require('../models/FIR');
const Complaint = require('../models/Complaint');
const Officer = require('../models/User'); // Assuming Officer is also in User model
const { auth, USER_ROLES } = require('../middleware/auth');

// ------------------ MULTER CONFIG ------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ------------------ SUBMIT FIR (CITIZEN) ------------------
router.post('/', upload.array('evidenceFiles'), async (req, res) => {
  try {
    const complaintData = typeof req.body.complaintData === 'string'
  ? JSON.parse(req.body.complaintData)
  : req.body.complaintData;

const complainant = complaintData.complainant;
const incidentDetails = complaintData.incidentDetails;
const crimeType = complaintData.crimeType;

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
      createdBy: req.user?._id || null,
      status: 'Pending',
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

    res.status(201).json({ message: 'FIR submitted successfully', fir });
  } catch (error) {
    console.error('FIR submission error:', error);
    res.status(400).json({ error: error.message });
  }
});

// ------------------ GET ALL FIRs ------------------
router.get('/', async (req, res) => {
  try {
    const firs = await FIR.find().sort({ createdAt: -1 });
    res.json(firs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FIRs' });
  }
});

// ------------------ GET FIR BY ID ------------------
router.get('/:id', async (req, res) => {
  try {
    const fir = await FIR.findById(req.params.id);
    if (!fir) return res.status(404).json({ error: 'FIR not found' });
    res.json(fir);
  } catch (error) {
    console.error('Error fetching FIR:', error);
    res.status(500).json({ error: 'Failed to fetch FIR detail' });
  }
});

// ------------------ OFFICER ACTION: ACCEPT/REJECT ------------------
router.patch('/:id/status', async (req, res) => {
  try {
    // Helper function to normalize the status value
    const normalizeStatus = (status) => {
      if (!status) return null;
      const s = status.toLowerCase();
      if (['pending', 'accepted', 'rejected'].includes(s)) {
        return s.charAt(0).toUpperCase() + s.slice(1);
      }
      return null;
    };

    const cleanStatus = normalizeStatus(req.body.status);
    const { rejectionReason } = req.body;
    const officerId = req.user?._id;

    if (!cleanStatus) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const fir = await FIR.findById(req.params.id);
    if (!fir) return res.status(404).json({ error: 'FIR not found' });

    fir.status = cleanStatus;
    fir.actionedBy = officerId;
    if (cleanStatus === 'Rejected') fir.rejectionReason = rejectionReason;

    await fir.save();

    if (cleanStatus === 'Accepted') {
      const complaint = new Complaint({
        firId: fir._id,
        complainant: fir.complainant,
        incidentDetails: fir.incidentDetails,
        crimeType: fir.crimeType,
        officer: officerId,
        status: 'Open',
        createdAt: new Date(),
      });
      await complaint.save();
    }

    res.json({ message: `FIR ${cleanStatus.toLowerCase()} successfully`, fir });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ error: 'Action failed' });
  }
});



module.exports = router;
