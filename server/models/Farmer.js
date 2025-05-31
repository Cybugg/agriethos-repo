const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  walletAddress: {
    type: String, 
    lowercase: true,
  },
  email:{
    type:String,
    lowercase: true,
    unique:true
  },
  nonce:{
    type:String,
  },
  farmId:{
    type:String,
  },
  newUser:{
    type:String,
    required:true,
    default:"true"
  },
  role:{
    type: String,
    required: true,
    default:'farmer'
  },
  last_transaction_stamp:{
   type:String,
   required: true,
   default:'farmer'
  },
  password: String,
  isEmailVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("Farmer", farmerSchema);

module.exports = User;
