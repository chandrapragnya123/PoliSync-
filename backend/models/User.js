const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['citizen', 'officer'],
    required: true
  },
  badgeNumber: { type: String },
  department: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Register with mongoose (global) so .populate('User') works
const UserModel = mongoose.connection.useDb('polisync').model('User', UserSchema);
mongoose.model('User', UserModel.schema); // 🔥 register globally for populate

module.exports = UserModel;
