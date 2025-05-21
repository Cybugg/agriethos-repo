const express = require("express");
const { 
  requestNonce, 
  verifySignature, 
  registerWithEmail, 
  loginWithEmail,
  verifyAuth,
  updateUserStatus,
  protect 
} = require("../controllers/authController");

const router = express.Router();

// Wallet-based authentication
router.post("/request-nonce", requestNonce);
router.post("/wallet-login", verifySignature);

// Email-based authentication
router.post("/register", registerWithEmail);
router.post("/login", loginWithEmail);

// Auth verification and session management
router.get("/verify", verifyAuth);
router.put("/update-status/:id", updateUserStatus);

// Protected route example
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});

module.exports = router;
