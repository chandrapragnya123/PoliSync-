const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  crimeTypes: [String],
  incidentDate: Date,
  incidentLocation: String,
  description: String,
  evidence: String
});

module.exports = mongoose.model('Complaint', complaintSchema);
