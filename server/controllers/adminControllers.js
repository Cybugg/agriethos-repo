const Reviewer = require('../models/Reviewer');
const Admin = require('../models/Admin');
const Crop = require("../models/Crop");
const Farmer = require('../models/Farmer');
const { ethers } = require('ethers');

const generateNonce = () => Math.floor(Math.random() * 1000000).toString();

// Function to add reviewer to blockchain
async function addReviewerToBlockchain(reviewerAddress) {
  try {
    const RPC_URL = process.env.SEPOLIA_RPC_URL;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY;
    const AgriEthosProductLedgerABI = require('../abi/AgriEthosProductLedger.json').abi;
    
    if (!RPC_URL || !CONTRACT_ADDRESS || !OWNER_PRIVATE_KEY) {
      throw new Error("Missing blockchain configuration");
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const ownerSigner = new ethers.Wallet(OWNER_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, AgriEthosProductLedgerABI, ownerSigner);
    
    // Check if already authorized
    const isAuthorized = await contract.authorizedReviewers(reviewerAddress);
    if (isAuthorized) {
      console.log(`Reviewer ${reviewerAddress} is already authorized on blockchain`);
      return null;
    }
    
    console.log(`Adding reviewer ${reviewerAddress} to blockchain...`);
    const tx = await contract.addReviewer(reviewerAddress);
    const receipt = await tx.wait();
    
    console.log(`Reviewer ${reviewerAddress} added to blockchain. TxHash: ${receipt.hash}`);
    return receipt.hash;
  } catch (error) {
    console.error(`Error adding reviewer to blockchain:`, error.message);
    throw error;
  }
}



exports.createAdmin = async (req, res) => {
    try {
      const { name, walletAddress, adminId } = req.body;
  console.log(adminId);
      // Check if the one making the request is an admin
      const validAdmin = await Admin.findOne({_id:adminId});
      if(!validAdmin)return res.status(401).json({mesage:"UNAUTHURIZED ACCEESS"});

      // Ensure wallet address is not already registered
      const existing = await Admin.findOne({ walletAddress: walletAddress.toLowerCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Admin already exists' });
      }
  
      const newAdmin = new Admin({
        name:name.toLowerCase(),
        walletAddress: walletAddress.toLowerCase(),
      });
  
      await newAdmin.save();
  
      res.status(201).json({ success: true, data: newAdmin });
    } catch (error) {
      console.error('Error creating admin:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  };

exports.createReviewer = async (req, res) => {
  try {
    const { name, walletAddress, adminId } = req.body;
    console.log(adminId);
    
    // Check if the one making the request is an admin
    const validAdmin = await Admin.findOne({_id:adminId});
    if(!validAdmin) return res.status(401).json({message:"UNAUTHORIZED ACCESS"});

    // Ensure wallet address is not already registered
    const existing = await Reviewer.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Agent already exists' });
    }

    const newAgent = new Reviewer({
      name: name.toLowerCase(),
      walletAddress: walletAddress.toLowerCase(),
      createdBy: adminId,
    });

    await newAgent.save();

    // Add reviewer to blockchain
    try {
      await addReviewerToBlockchain(walletAddress.toLowerCase());
      console.log(`Reviewer ${walletAddress} successfully added to blockchain`);
    } catch (blockchainError) {
      console.error(`Failed to add reviewer to blockchain:`, blockchainError.message);
      // Don't fail the whole operation, but log the error
      // The reviewer is still created in the database
    }

    res.status(201).json({ success: true, data: newAgent });
  } catch (error) {
    console.error('Error creating reviewer:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.adminLogin = async (req, res) => {

  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ success: false, message: 'Wallet address is required' });
  }
  const timestamp = new Date().toISOString();

  try {
    let admin = await Admin.findOne({ walletAddress });

    if (!admin) {
      return res.status(401).json("UNAUTHURIZED ACCESS")
    }
    else {
      admin.nonce = generateNonce(); // refresh nonce each time
    }
  admin.last_transaction_stamp = timestamp;
  
    console.log(timestamp);
  await admin.save();

    return res.status(200).json({ success: true, data: admin,nonce: admin.nonce ,timestamp:timestamp});
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.verifySignature = async (req, res) => {

  // Get address and signature from the client
  const { address, signature } = req.body;

  // If any of the request field is missing -> return a bad request status
  if (!address || !signature) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Fetch user from the database 
  const admin = await Admin.findOne({ walletAddress: address.toLowerCase() });
  
  // If admin is not on the database -> Return 404 cannot find status
  if (!admin) return res.status(400).json({ error: "admin not found" });

  // Mesage (Must align with the client's message)
  const message = `Welcome to AgriEthos 🌱

Sign this message to verify you own this wallet and authenticate securely.

Wallet Address: ${address}
Nonce: ${admin.nonce}
Timestamp: ${admin.last_transaction_stamp}

This request will not trigger a blockchain transaction or cost any gas.

Only sign this message if you trust AgriEthos.
  `;

  console.log(address,admin.nonce,admin.last_transaction_stamp);


  try {
    // verify the message
    const recovered = ethers.verifyMessage(message, signature);
    // If the the parsed address is same as the recovered
    if (recovered.toLowerCase() === address.toLowerCase()) {

      // Reset nonce to prevent reuse
      Admin.nonce = generateNonce();
   
      await admin.save();




      return res.json({ success: true, message: "Wallet verified", data:{admin}});
    } else {
      return res.status(401).json({ error: "Signature verification failed" });
    }
  } catch (err) {
    console.error("Signature verification error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


exports.getReviewersByAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    const reviewers = await Reviewer.find({ createdBy: adminId });
    return res.status(200).json({ success: true, data: reviewers });
  } catch (error) {
    console.error('Error fetching reviewers:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};



exports.getAdminOverview = async(req,res)=>{
  const {adminId} = req.params;
  try{
    // verify if the admin exists
 const admin = await Admin.findOne({_id:adminId});
 if(!admin){
   return res.status(401).json({ error: error.message || "UNAUTHURIZED" });
 }
 // Let's proceed if we verify the admin
   // let get some overview data 
   const allfarmers = await Farmer.find();
   const allCrops = await Crop.find();
   const allAdmins = await Admin.find();
   const allReviewers = await Reviewer.find();

   res.status(201).json({data:{farmersNo:allfarmers.length,cropsNo:allCrops.length,adminsNo:allAdmins.length,reviewersNo:allReviewers.length}})
  }
  catch(err){
    res.status(404).json({message:err.message})
  }
}


exports.getAllAdmins = async (req,res)=> {
  const {adminId} = req.params;
  try{
     // verify if the admin exists
  const admin = await Admin.findOne({_id:adminId});
  if(!admin){
    return res.status(401).json({ error: error.message || "UNAUTHURIZED" });
  }
  // Let's proceed if we verify the admin
  const admins = await Admin.find();
  if(!admins){
    return res.status(404).json({error: error.message || "Cannot find admin" })
  }
  return res.status(201).json({data:admins})
  }

 catch(err){
console.log(err)
 }
}
exports.getAllAgents = async (req,res)=> {
  const {adminId} = req.params;
  try{
     // verify if the admin exists
  const admin = await Admin.findOne({_id:adminId});
  if(!admin){
    return res.status(401).json({error: error.message || "UNAUTHURIZED" });
  }
  // Let's proceed if we verify the admin
  const agents = await Reviewer.find();
  if(!agents){
    return res.status(404).json({error: error.message || "Cannot find agent" })
  }
  return res.status(201).json({data:agents})
  }

 catch(err){
console.log(err)
 }
}

exports.superCreate = async (req,res) =>{
  const {walletddress} = req.body;
try{
   // Ensure wallet address is not already registered
   let existing = await Admin.findOne({ walletAddress: walletAddress.toLowerCase()});
  existing = await Admin.findOne({ name:"0xCybug".toLowerCase() });
   if (existing) {
     return res.status(400).json({ success: false, message: 'Admin already exists' });
   }

   const newAdmin = new Admin({
     name:"0xCybug".toLowerCase(),
     walletAddress: walletAddress.toLowerCase(),
   });

   await newAdmin.save();

   res.status(201).json({ success: true, data: newAdmin });
}
catch (error) {
  console.error('Error creating admin:', error);
  res.status(500).json({ success: false, message: 'Server Error', error: error.message });
}
}