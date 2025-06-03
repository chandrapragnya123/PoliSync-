//import required modules , 
// mongoose: ODM (Object Data Modeling) library to interact with MongoDB using JavaScript.
//bcryptjs: Used to hash passwords before storing them in the database for security.
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//This line creates a new Mongoose schema, which defines the structure of a User document in MongoDB.
const UserSchema = new mongoose.Schema({
  //User Fields (Schema Properties)
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  //User's password. Required. Will be hashed before saving.
  password: { type: String, required: true }, 
  //Role defines whether the user is a citizen or a police officer.
  //Only these two values are allowed (enum).
  role: { 
    type: String, 
    enum: ['citizen', 'police'],
    required: true 
  },
  // Police-specific fields
  //badgeNumber and department are only used for police users.
  //They are optional (not required).
  badgeNumber: { type: String },
  department: { type: String },
  //Automatically sets the creation date/time when the user is saved.
  createdAt: { type: Date, default: Date.now } 
});

// Password hashing middleware This is a pre-save hook. It runs before the user is saved.
UserSchema.pre('save', async function(next) {
  //If the password field hasn’t changed, skip hashing. Useful during user updates.
  if (!this.isModified('password')) return next(); 
  this.password = await bcrypt.hash(this.password, 10);
  //Hashes the password using bcrypt. Salt rounds = 10.
  //Makes sure even if two users have the same password, their hashes will be different.
  next();
  //Proceeds to save the document after hashing.
});

module.exports = mongoose.model('User', UserSchema);
//Registers the schema as a Mongoose model named "User".
//You can now use User elsewhere to create, read, update, and delete user documents.

//SALT ROUNDS
//What Is a Salt?
// A salt is random data added to a password before it’s hashed.
// Purpose: To prevent two identical passwords from having the same hash.
// Result: Even if two users have the same password, their hashes will be different.

// 🔁 What Are Salt Rounds?
// Salt rounds determine how many times the hashing algorithm is applied (or how complex it is).
// bcrypt.hash(password, 10);
// The number 10 is the number of salt rounds (also called cost factor).
// It means: "Perform the hashing algorithm 2¹⁰ (1024) times internally."
//10 is a balanced default — secure but not too slow.
//Higher values increase security but may slow down your app if you have many logins.