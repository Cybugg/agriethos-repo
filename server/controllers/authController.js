const Farmer = require('../models/Farmer');
const { ethers } = require('ethers');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Use a proper environment variable with a strong secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_strong_secret_key_change_in_production';
const JWT_EXPIRES_IN = '7d'; // Token expiration time

// Generate a random nonce
const generateNonce = () => Math.floor(Math.random() * 1000000).toString();

// Create JWT token with user data
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      role: user.role,
      newUser: user.newUser,
      email: user.email,
      walletAddress: user.walletAddress
    }, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verify token and return decoded user data
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    return {
      valid: false,
      expired: error.name === "TokenExpiredError",
      decoded: null
    };
  }
};

// Request nonce for wallet login
exports.requestNonce = async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) return res.status(400).json({ success: false, error: "Address required" });
    
    const timestamp = new Date().toISOString();
    let user = await Farmer.findOne({ walletAddress: address.toLowerCase() });

    if (!user) {
      user = new Farmer({ 
        walletAddress: address.toLowerCase(), 
        nonce: generateNonce(),
        last_transaction_stamp: timestamp
      });
    } else {
      user.nonce = generateNonce();
      user.last_transaction_stamp = timestamp;
    }
    
    await user.save();
    res.json({ success: true, nonce: user.nonce, timestamp: timestamp });
  } catch (error) {
    console.error("Nonce request error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Wallet-based login with signature verification
exports.verifySignature = async (req, res) => {
  try {
    const { address, signature } = req.body;

    if (!address || !signature) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const user = await Farmer.findOne({ walletAddress: address.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const message = `Welcome to AgriEthos 🌱

Sign this message to verify you own this wallet and authenticate securely.

Wallet Address: ${address}
Nonce: ${user.nonce}
Timestamp: ${user.last_transaction_stamp}

This request will not trigger a blockchain transaction or cost any gas.

Only sign this message if you trust AgriEthos.`;

    const recovered = ethers.verifyMessage(message, signature);
    
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ success: false, error: "Signature verification failed" });
    }

    // Generate a new nonce for security
    user.nonce = generateNonce();
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    // Send response with token and user data
    return res.json({ 
      success: true, 
      message: "Authentication successful", 
      data: {
        token,
        user: {
          _id: user._id,
          email: user.email,
          walletAddress: user.walletAddress,
          newUser: user.newUser,
          role: user.role
        }
      }
    });
  } catch (err) {
    console.error("Signature verification error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Email registration
exports.registerWithEmail = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    // Check if email already exists
    const existingUser = await Farmer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use"
      });
    }

    // Create new farmer with email/password
    const timestamp = new Date().toISOString();
    const farmer = new Farmer({
      email,
      password, // Will be hashed by pre-save hook
      nonce: generateNonce(),
      last_transaction_stamp: timestamp
    });

    await farmer.save();

    // Generate JWT token
    const token = generateToken(farmer);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        token,
        user: {
          _id: farmer._id,
          email: farmer.email,
          newUser: farmer.newUser,
          role: farmer.role
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Email login
exports.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user by email and explicitly include password field for comparison
    const farmer = await Farmer.findOne({ email }).select('+password');
    
    if (!farmer) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Compare passwords
    const isMatch = await farmer.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate token
    const token = generateToken(farmer);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          _id: farmer._id,
          email: farmer.email,
          newUser: farmer.newUser,
          role: farmer.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Verify auth status (check if token is valid)
exports.verifyAuth = async (req, res) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "No authentication token provided"
      });
    }

    const token = authorization.split(' ')[1];
    const { valid, expired, decoded } = verifyToken(token);

    if (!valid) {
      return res.status(401).json({ 
        success: false, 
        message: expired ? "Token expired" : "Invalid token"
      });
    }

    // Get fresh user data from database
    const user = await Farmer.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists"
      });
    }

    // Send back the user data with a refreshed token
    const refreshedToken = generateToken(user);

    return res.json({
      success: true,
      data: {
        token: refreshedToken,
        user: {
          _id: user._id,
          email: user.email,
          walletAddress: user.walletAddress,
          newUser: user.newUser,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Update user status (e.g., after onboarding)
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { newUser } = req.body;
    
    // Find and update the farmer
    const farmer = await Farmer.findByIdAndUpdate(
      id,
      { newUser },
      { new: true }
    );
    
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Generate a fresh token with updated user data
    const token = generateToken(farmer);
    
    res.status(200).json({
      success: true,
      message: "User status updated",
      data: {
        token,
        user: {
          _id: farmer._id,
          email: farmer.email,
          walletAddress: farmer.walletAddress,
          newUser: farmer.newUser,
          role: farmer.role
        }
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  try {
    // Get token from header
    const { authorization } = req.headers;
    
    if (!authorization || !authorization.startsWith('Bearer')) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token"
      });
    }
    
    const token = authorization.split(' ')[1];
    const { valid, expired, decoded } = verifyToken(token);
    
    if (!valid) {
      return res.status(401).json({ 
        success: false, 
        message: expired ? "Token expired" : "Invalid token"
      });
    }
    
    // Get user from database
    const user = await Farmer.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: "Not authorized",
      error: error.message
    });
  }
};