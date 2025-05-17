const Reviewer = require('../models/Reviewer');
const Admin = require('../models/Admin');


exports.createAdmin = async (req, res) => {
    try {
      const { name, walletAddress } = req.body;
  
      // Ensure wallet address is not already registered
      const existing = await Admin.findOne({ walletAddress: walletAddress.toLowerCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Admin already exists' });
      }
  
      const newAdmin = new Admin({
        name,
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
    const { name, walletAddress } = req.body;
    const adminId = req.user._id; // set via middleware after wallet auth

    const newReviewer = new Reviewer({
      name,
      walletAddress: walletAddress.toLowerCase(),
      createdBy: adminId,
    });

    await newReviewer.save();

    res.status(201).json({ success: true, data: newReviewer });
  } catch (err) {
    console.error('Error creating reviewer:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.adminLogin = async (req, res) => {
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
