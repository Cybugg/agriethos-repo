const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true, 
    lowercase: true,
  },
  nonce:{
    type:String,
    required:true
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("Farmer", farmerSchema);

module.exports = User;
