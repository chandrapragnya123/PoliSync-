const express = require('express');
const router = express.Router();
const FIR = require('../models/FIR');
const { auth ,USER_ROLES } = require('../middleware/auth');

// Citizen submits FIR
router.post('/', auth([USER_ROLES.CITIZEN]), async (req, res) => {
  try {
    const firData = {
      ...req.body,
      complainant: {
        userId: req.user._id,
        ...req.body.complainant
      },
      status: 'Pending'
    };

    const fir = new FIR(firData);
    await fir.save();
    
    res.status(201).json({
      message: 'FIR submitted successfully',
      firNumber: fir.firNumber
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Police views pending FIRs
router.get('/pending', auth([USER_ROLES.POLICE]), async (req, res) => {
  try {
    const pendingFirs = await FIR.find({ status: 'Pending' });
    res.json(pendingFirs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Police approves/rejects FIR
router.patch('/:id/status', auth([USER_ROLES.POLICE]), async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const update = { 
      status,
      assignedOfficer: req.user._id,
      updatedAt: new Date()
    };

    if (status === 'Rejected') {
      update.statusMessage = rejectionReason || 'FIR request declined';
    } else {
      update.statusMessage = 'FIR approved and under investigation';
    }

    const fir = await FIR.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!fir) {
      return res.status(404).json({ error: 'FIR not found' });
    }

    res.json(fir);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Citizen views their FIRs
router.get('/my-firs', auth([USER_ROLES.CITIZEN]), async (req, res) => {
  try {
    const firs = await FIR.find({ 'complainant.userId': req.user._id })
                         .sort({ createdAt: -1 });
    res.json(firs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Police views approved FIRs (for manage complaints)
router.get('/approved', auth([USER_ROLES.POLICE]), async (req, res) => {
  try {
    const approvedFirs = await FIR.find({ status: 'Approved' });
    res.json(approvedFirs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;