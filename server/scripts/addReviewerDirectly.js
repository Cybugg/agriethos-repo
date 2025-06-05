const mongoose = require('mongoose');
const Reviewer = require('../models/Reviewer');
const Admin = require('../models/Admin');
require('dotenv').config();

async function addReviewerDirectly() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // First, find an existing admin or create one
    let admin = await Admin.findOne();
    if (!admin) {
      // Create a temporary admin if none exists
      admin = new Admin({
        name: "System Admin",
        walletAddress: "0x0000000000000000000000000000000000000000"
      });
      await admin.save();
      console.log('Created temporary admin');
    }

    // Check if reviewer already exists
    const existingReviewer = await Reviewer.findOne({ 
      walletAddress: "0x6542034145F96b8F244716F37Cd0e337D1fCDa08" 
    });
    
    if (existingReviewer) {
      console.log('Reviewer already exists!');
      await mongoose.disconnect();
      return;
    }

    // Create the new reviewer
    const newReviewer = new Reviewer({
      name: "New Reviewer", // Replace with actual name
      walletAddress: "0x6542034145F96b8F244716F37Cd0e337D1fCDa08",
      createdBy: admin._id
    });

    await newReviewer.save();
    console.log('✅ Reviewer added to database successfully');
    console.log('Reviewer ID:', newReviewer._id);
    console.log('Wallet Address:', newReviewer.walletAddress);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
}

addReviewerDirectly();