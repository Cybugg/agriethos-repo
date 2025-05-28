const express = require("express");
const { requestNonce, verifySignature, registerWithEmail, verifyEmail, resendReverification, loginWithEmail } = require("../controllers/authController");

const router = express.Router();

// POST route for wallet-based login
router.post("/request-nonce", requestNonce);
router.post("/wallet-login", verifySignature);
router.post("/email-register", registerWithEmail);
router.post("/email-verify", verifyEmail);
router.post("/email-reverify", resendReverification);
router.post("/email-login",loginWithEmail);
// for email based auth

module.exports = router;
