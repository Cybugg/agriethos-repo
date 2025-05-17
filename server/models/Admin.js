// models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin',
  },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);


