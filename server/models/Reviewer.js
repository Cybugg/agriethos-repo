// models/Reviewer.js
const mongoose = require('mongoose');
const generateNonce = () => Math.floor(Math.random() * 1000000).toString();


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

  nonce:{
    type:String,
    required:true,
    default:generateNonce()
  },
  last_transaction_stamp:{
    type:String,
    required: true,
    default:'farmer'
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
