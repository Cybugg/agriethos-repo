const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Add this dependency

const farmerSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    unique: true, 
    lowercase: true,
    sparse: true, // Allow null/undefined values to support email-only registration
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allow null/undefined values to support wallet-only registration
  },
  password: {
    type: String, // Will store hashed password
    select: false, // Don't include password in query results by default
  },
  nonce: {
    type: String,
    required: true
  },
  farmId: {
    type: String,
  },
  newUser: {
    type: String,
    required: true,
    default: "true"
  },
  role: {
    type: String,
    required: true,
    default: 'farmer'
  },
  last_transaction_stamp: {
   type: String,
   required: true,
   default: new Date().toISOString()
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to hash password
farmerSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) return next();
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
farmerSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model("Farmer", farmerSchema);

module.exports = User;
