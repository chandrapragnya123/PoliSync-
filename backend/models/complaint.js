const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complainant: {
    fullName: String,
    email: String,
    phoneNumber: String,
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'India' }
    }
  },
  crimeType: {
    mainCategory: String,
    subCategories: [String],
    customDescription: String
  },
  incidentDetails: {
    date: Date,
    time: String,
    location: {
      address: String,
      landmark: String,
      gpsCoordinates: {
        lat: Number,
        lng: Number
      }
    },
    description: String,
    witnesses: [{
      name: String,
      contact: String,
      statement: String
    }],
    evidence: [
      {
        type: String,
        url: String,
        description: String,
        uploadedAt: Date
      }
    ]
  },
  firNumber: { type: String, unique: true },
  acceptedAt: { type: Date, default: Date.now },
  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
