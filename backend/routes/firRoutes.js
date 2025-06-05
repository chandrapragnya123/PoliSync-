const express = require('express');
const router = express.Router();
const multer = require('multer');
const FIR = require('../models/FIR');
const Complaint = require('../models/Complaint');
const { auth, USER_ROLES } = require('../middleware/auth');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Citizen submits FIR
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
      createdBy: req.user._id,
      complainant,
      crimeType,
      incidentDetails: {
        ...incidentDetails,
        evidence: []
      },
      status: 'Pending'
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
    res.status(400).json({ error: error.message });
  }
});

// Police/Admin updates FIR status
router.patch('/:id/status', auth([USER_ROLES.POLICE, USER_ROLES.ADMIN]), async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value. Must be Accepted or Rejected.' });
    }

    const fir = await FIR.findById(req.params.id);
    if (!fir) return res.status(404).json({ error: 'FIR not found' });

    fir.status = status;
    fir.actionedBy = req.user._id;

    if (status === 'Rejected') {
      if (!rejectionReason?.trim()) {
        return res.status(400).json({ error: 'Rejection reason required for rejected FIR' });
      }
      fir.rejectionReason = rejectionReason;
      await fir.save();
      return res.status(200).json({ message: 'FIR rejected successfully' });
    }

    if (status === 'Accepted') {
      fir.rejectionReason = '';
      fir.assignedOfficer = fir.assignedOfficer || req.user._id;
      await fir.save();

      try {
        const existingComplaint = await Complaint.findOne({ firNumber: fir.firNumber });
        if (!existingComplaint) {
          const complaintData = {
            complainant: fir.complainant,
            crimeType: fir.crimeType,
            incidentDetails: fir.incidentDetails,
            firNumber: fir.firNumber,
            acceptedAt: new Date(),
            assignedOfficer: fir.assignedOfficer,
            createdAt: fir.createdAt
          };
          const complaint = new Complaint(complaintData);
          await complaint.save();
          console.log(`Complaint created successfully for FIR number: ${fir.firNumber}`);  // Log success
        } else {
          console.log(`Complaint already exists for FIR number: ${fir.firNumber}`);  // Log if complaint exists
        }
        

        return res.status(200).json({ message: 'FIR accepted and complaint created successfully' });
      } catch (err) {
        console.error('Complaint creation failed:', err);
        return res.status(500).json({ error: 'Complaint creation failed after FIR acceptance' });
      }
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Citizen views their own FIRs
router.get('/my-firs', auth([USER_ROLES.CITIZEN]), async (req, res) => {
  try {
    const firs = await FIR.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(firs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Police views approved FIRs
router.get('/approved', auth([USER_ROLES.POLICE]), async (req, res) => {
  try {
    const approvedFirs = await FIR.find({ status: 'Accepted' });
    res.json(approvedFirs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Police/Admin views all FIRs (summary)
router.get('/', auth([USER_ROLES.POLICE, USER_ROLES.ADMIN]), async (req, res) => {
  try {
    const firs = await FIR.find({})
      .populate('assignedOfficer', 'name')
      .select({
        'complainant.fullName': 1,
        'incidentDetails.description': 1,
        'incidentDetails.date': 1,
        'crimeType.mainCategory': 1,
        status: 1,
        rejectionReason: 1,
        assignedOfficer: 1
      })
      .lean();

    res.json(firs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific FIR by ID with access control
router.get('/:id', auth([USER_ROLES.POLICE, USER_ROLES.ADMIN, USER_ROLES.CITIZEN]), async (req, res) => {
  try {
    const fir = await FIR.findById(req.params.id)
      .populate('assignedOfficer', 'name')
      .populate('createdBy', 'name');

    if (!fir) return res.status(404).json({ error: 'FIR not found' });

    if (req.user.role === USER_ROLES.CITIZEN && fir.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(fir);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
