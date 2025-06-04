const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complainant: {
    fullName: String,
    email: String,
    phoneNumber: String,
    address: {
      street: String
    }
  },
  crimeType: {
    mainCategory: String,
    subCategories: [String]
  },
  incidentDetails: {
    date: Date,
    location: {
      address: String
    },
    description: String
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  evidence: {
    originalname: String,
    mimetype: String,
    buffer: Buffer
  },
  type: { type: String, default: 'web' },
  status: { type: String, default: 'Not Allocated' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }

});

module.exports = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
