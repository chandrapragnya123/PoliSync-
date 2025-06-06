const mongoose = require('mongoose');

const FIRSchema = new mongoose.Schema({
  complainant: {
    fullName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /\d{10}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'India' }
    }
  },
  crimeType: {
    mainCategory: {
      type: String,
      required: true,
      enum: ['theft', 'assault', 'fraud', 'cybercrime', 'other', 'domestic violence', 'sexual assault', 'vandalism', 'drug-related','burglary', 'robbery', 'physical', 'verbal', 'financial', 'identity', 'hacking', 'online harassment','harassment', 'extortion', 'malware', 'phishing']
    },
    subCategories: [{
      type: String,
      enum: ['burglary', 'robbery', 'physical', 'verbal', 'financial', 'identity', 'hacking', 'online harassment','harassment', 'extortion', 'malware', 'phishing', 'other']
    }],
    customDescription: String
  },
  incidentDetails: {
    date: { type: Date, required: true },
    time: String,
    location: {
      address: String,
      landmark: String,
      gpsCoordinates: {
        lat: Number,
        lng: Number
      }
    },
    description: { type: String, required: true, minlength: 20 },
    witnesses: [{
      name: String,
      contact: String,
      statement: String
    }],
    evidence: [
      {
        type: { type: String, enum: ['image', 'video', 'document', 'other'] },
        url: String,
        description: String,
        uploadedAt: { type: Date, default: Date.now }
      }
    ]
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  actionedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: String,
  firNumber: { type: String , default: undefined }, // removed `unique: true`
  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

FIRSchema.pre('save', function(next) {
  if (!this.firNumber && this.status === 'Accepted') {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.firNumber = `FIR/${year}/${randomNum}`;
  }
  this.updatedAt = new Date();
  next();
});
// Add this line before exporting
FIRSchema.index({ firNumber: 1 }, { unique: true, sparse: true });
// Ensure null is never stored accidentally
FIRSchema.pre('validate', function(next) {
  if (this.firNumber === null) {
    this.firNumber = undefined;
  }
  next();
});

module.exports = mongoose.model('FIR', FIRSchema);
