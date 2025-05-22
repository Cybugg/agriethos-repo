const express = require("express");
const { agentLogin, verifySignature } = require("../controllers/agentController");

const router = express.Router();



// POST route for wallet-based login
router.post("/request-nonce", agentLogin);
router.post("/wallet-login", verifySignature);


module.exports = router;