const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // you can configure destination and filename


// Imports the FIR model and auth middleware
const FIR = require('../models/FIR');
const { auth, USER_ROLES } = require('../middleware/auth');

// -----------------------------------------------------------------------------
// Citizen submits FIR (POST /api/firs)
router.post('/', auth([USER_ROLES.CITIZEN]), upload.single('evidence'), async (req, res) => {
  try {
    const parsedFirData = JSON.parse(req.body.firData);

    const firData = {
      ...parsedFirData,
      createdBy: req.user._id,
      status: 'Submitted',
    };

    if (req.file) {
      firData.evidence = {
        fileName: req.file.originalname,
        filePath: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size
      };

    }

    const fir = new FIR(firData);
    await fir.save();

    res.status(201).json({
      message: 'FIR submitted successfully',
      firNumber: fir.firNumber
    });
  } catch (error) {
    console.error('FIR submission error:', error);
    res.status(400).json({ error: error.message });
  }
});


// -----------------------------------------------------------------------------
// Police views pending FIRs (GET /api/firs/pending)
router.get('/pending', auth([USER_ROLES.POLICE]), async (req, res) => {
  try {
    const pendingFirs = await FIR.find({ status: 'Submitted' });
    res.json(pendingFirs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------------------------------------------------------
// Police updates FIR status (PATCH /api/firs/:id/status)
router.patch('/:id/status', auth([USER_ROLES.POLICE]), async (req, res) => {

  try {
    const { status, rejectionReason } = req.body;

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value. Must be Accepted or Rejected.' });
    }

    const fir = await FIR.findById(req.params.id);
    if (!fir) return res.status(404).json({ error: 'FIR not found' });

    fir.status = status;
    fir.actionedBy = req.user._id;

    if (status === 'Rejected' && (!rejectionReason || rejectionReason.trim() === '')) {
      return res.status(400).json({ error: 'Rejection reason required for rejected FIR' });
    }
    fir.rejectionReason = status === 'Rejected' ? rejectionReason : '';

    await fir.save();

    res.json({ message: `FIR ${status.toLowerCase()} successfully`, fir });
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

// Police/Admin views all FIRs
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

    // Only creator or Police/Admin can view
    if (req.user.role === USER_ROLES.CITIZEN && fir.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(fir);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


// POST /api/firs — citizen submits new FIR

// PATCH /api/firs/:id/status — police/admin updates FIR status and rejection reason

// GET /api/firs/my-firs — citizen gets own FIRs

// GET /api/firs/approved — police gets accepted FIRs

// GET /api/firs/ — police/admin get all FIRs

// GET /api/firs/:id — get FIR details with access control