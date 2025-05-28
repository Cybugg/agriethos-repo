const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    unique: true, 
    lowercase: true,
    sparse: true,
  },
  email:{
    type:String,
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
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("Farmer", farmerSchema);

module.exports = User;
