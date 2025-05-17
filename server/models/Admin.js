// models/Admin.js
const mongoose = require('mongoose');
const generateNonce = () => Math.floor(Math.random() * 1000000).toString();


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
    role: {
    type: String,
    enum: ['admin'],
    default: 'admin',
  },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);


