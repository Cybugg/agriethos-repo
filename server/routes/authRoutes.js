const express = require("express");
const { requestNonce, verifySignature, registerWithEmail, verifyEmail, resendReverification, loginWithEmail, changePassword } = require("../controllers/authController");

const router = express.Router();

// POST route for wallet-based login
router.put("/request-nonce/:id", requestNonce);
router.post("/wallet-login/:id", verifySignature);
router.post("/email-register", registerWithEmail);
router.post("/email-verify", verifyEmail);
router.post("/email-reverify", resendReverification);
router.post("/email-login",loginWithEmail);
router.put("/changePass/:id", changePassword)
// for email based auth

module.exports = router;
