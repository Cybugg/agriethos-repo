const express = require("express");
const { requestNonce, verifySignature, registerWithEmail, verifyEmail, resendReverification } = require("../controllers/authController");

const router = express.Router();

// POST route for wallet-based login
router.post("/request-nonce", requestNonce);
router.post("/wallet-login", verifySignature);
router.post("/email-register", registerWithEmail);
router.post("/email-verify", verifyEmail);
router.post("/email-reverify", resendReverification);
// for email based auth

module.exports = router;
