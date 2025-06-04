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
      enum: ['Theft', 'Assault', 'Fraud', 'Cybercrime', 'Other']
    },
    subCategories: [{
      type: String,
      enum: ['Burglary', 'Robbery', 'Physical', 'Verbal', 'Financial', 'Identity', 'Hacking', 'Online Harassment']
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
        url: String,               // path or URL to uploaded file
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
  rejectionReason: {
    type: String
  },
  firNumber: { type: String, unique: true },
  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

FIRSchema.pre('save', function(next) {
  if (!this.firNumber) {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.firNumber = `FIR/${year}/${randomNum}`;
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('FIR', FIRSchema);
