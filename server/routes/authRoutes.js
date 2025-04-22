const express = require("express");
const { requestNonce, verifySignature } = require("../controllers/authController");

const router = express.Router();

// POST route for wallet-based login
router.post("/request-nonce", requestNonce);
router.post("/wallet-login", verifySignature);

module.exports = router;
