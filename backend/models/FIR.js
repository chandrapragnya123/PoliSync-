//Imports Mongoose — a library to define MongoDB schemas and interact with the database using models.
const mongoose = require('mongoose');

//Begins the schema definition for the FIR (First Information Report).
// Everything inside this object defines how a single FIR document will look.
const FIRSchema = new mongoose.Schema({

  // Personal Information Section

  //complainant: A nested object containing details of the person filing the FIR.
  //fullName: Required string for the complainant’s name.
  complainant: {
    fullName: { type: String, required: true },

    //Validates email format using a regex pattern. If it fails, it shows a custom error.
    email: { 
      type: String, 
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phoneNumber: { //Ensures the phone number is a 10-digit number using a custom validator.
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /\d{10}/.test(v); // Simple 10-digit phone validation
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
    } //A nested object for the address, with a default country set to India.
  },

  // Crime Information Section
  crimeType: {
    mainCategory: { 
      type: String, 
      required: true,
      enum: ['Theft', 'Assault', 'Fraud', 'Cybercrime', 'Other']
    }, //mainCategory is required and must be one of the defined values using enum.

    subCategories: [{
      type: String,
      enum: ['Burglary', 'Robbery', 'Physical', 'Verbal', 'Financial', 'Identity', 'Hacking', 'Online Harassment']
    }], //An array of subcategories, each restricted to specific crime types.

    customDescription: String // Allows for a custom description if "Other" is selected.
  },

  // Incident Details
  incidentDetails: {
    date: { type: Date, required: true }, //date is required; time is optional.
    time: String,
    location: {
      address: String,
      landmark: String,
      gpsCoordinates: { //Nested location object supports GPS coordinates and descriptive address fields.
        lat: Number,
        lng: Number
      }
    },
    //Detailed FIR must be at least 20 characters long.
    description: { type: String, required: true, minlength: 20 },
    witnesses: [{
      name: String,
      contact: String,
      statement: String
    }], //An array of witnesses, each with name, contact, and their statement.

    evidence: [{ //Array of evidence entries, where each item has a type, URL (file path), description, and timestamp.
      type: { type: String, enum: ['image', 'video', 'document', 'other'] },
      url: String,
      description: String,
      uploadedAt: { type: Date, default: Date.now }
    }]
  },

  // System Fields
  status: {
    type: String,
    enum: ['Pending', 'Submitted', 'Under Investigation', 'Resolved', 'Rejected'],
    default: 'Pending'
  }, //Status of the FIR for tracking progress. Defaults to 'Pending'.

  firNumber: { type: String, unique: true }, //Will store a unique FIR ID like FIR/2025/1234.
  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId, //Reference to the User model (police officer) handling this FIR
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }, //Automatically stores timestamps.
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
    //The user who submitted the FIR (could be a citizen). Required.
  }
});

// Auto-generate FIR number before saving , This hook runs before saving the FIR to MongoDB.
FIRSchema.pre('save', function(next) {
  if (!this.firNumber) {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.firNumber = `FIR/${year}/${randomNum}`;
    //Auto-generates a unique firNumber using the current year
    // and a 4-digit random number. Example: FIR/2025/5678.
  }
  this.updatedAt = new Date(); //Always updates updatedAt timestamp when saving.
  next();
});

module.exports = mongoose.model('FIR', FIRSchema);
//Compiles the schema into a model named FIR.
//You can now use FIR.find(), FIR.create(), etc., in your controllers.