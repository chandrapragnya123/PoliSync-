const FIR = require('../models/FIR');

exports.createFIR = async (req, res) => {
  try {
    const firData = {
      ...req.body,
      createdBy: req.user._id
    };

    const newFIR = new FIR(firData);
    await newFIR.save();

    res.status(201).json({ message: 'FIR created successfully', fir: newFIR });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
