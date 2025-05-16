// models/Reviewer.js
const mongoose = require('mongoose');

const reviewerSchema = new mongoose.Schema({
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  role: {
    type: String,
    enum: ['reviewer'],
    default: 'reviewer',
  },
}, { timestamps: true });

module.exports = mongoose.model('Reviewer', reviewerSchema);
