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


// controllers/adminController.ts
import Admin from '../models/Admin';

export const adminLogin = async (req, res) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ success: false, message: 'Wallet address is required' });
  }

  try {
    let admin = await Admin.findOne({ walletAddress });

    if (!admin) {
      // Optional: Auto-create admin if not exists
      admin = await Admin.create({ walletAddress });
    }

    return res.status(200).json({ success: true, data: admin });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// controllers/reviewerController.ts
import Reviewer from '../models/Reviewer';

export const getReviewersByAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    const reviewers = await Reviewer.find({ createdBy: adminId });
    return res.status(200).json({ success: true, data: reviewers });
  } catch (error) {
    console.error('Error fetching reviewers:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
