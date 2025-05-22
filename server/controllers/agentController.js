const Reviewer = require('../models/Reviewer');
const Crop = require("../models/Crop");
const Farmer = require('../models/Farmer');

const {ethers} = require('ethers');

const generateNonce = () => Math.floor(Math.random() * 1000000).toString();





exports.agentLogin = async (req, res) => {

  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ success: false, message: 'Wallet address is required' });
  }
  const timestamp = new Date().toISOString();

  try {
    let agent = await Reviewer.findOne({ walletAddress });

    if (!agent) {
      return res.status(401).json("UNAUTHURIZED ACCESS")
    }
    else {
      agent.nonce = generateNonce(); // refresh nonce each time
    }
  agent.last_transaction_stamp = timestamp;
  
    console.log(timestamp);
  await agent.save();

    return res.status(200).json({ success: true, data: agent,nonce: agent.nonce ,timestamp:timestamp});
  } catch (error) {
    console.error('agent login error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.verifySignature = async (req, res) => {

  // Get address and signature from the client
  const { address, signature } = req.body;

  // If any of the request field is missing -> return a bad request status
  if (!address || !signature) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Fetch user from the database 
  const agent = await Reviewer.findOne({ walletAddress: address.toLowerCase() });
  
  // If agent is not on the database -> Return 404 cannot find status
  if (!agent) return res.status(400).json({ error: "agent not found" });

  // Mesage (Must align with the client's message)
  const message = `Welcome to AgriEthos 🌱

Sign this message to verify you own this wallet and authenticate securely.

Wallet Address: ${address}
Nonce: ${agent.nonce}
Timestamp: ${agent.last_transaction_stamp}

This request will not trigger a blockchain transaction or cost any gas.

Only sign this message if you trust AgriEthos.
  `;

  console.log(address,agent.nonce,agent.last_transaction_stamp);


  try {
    // verify the message
    const recovered = ethers.verifyMessage(message, signature);
    // If the the parsed address is same as the recovered
    if (recovered.toLowerCase() === address.toLowerCase()) {

      // Reset nonce to prevent reuse
      agent.nonce = generateNonce();
   
      await agent.save();
console.log(recovered.toLowerCase());
console.log(address.toLowerCase())

console.log("agent:",agent);

      return res.json({ success: true, message: "Wallet verified", data:{agent}});
    } else {
        console.log(agent)
      return res.status(401).json({ error: "Signature verification failed" });
    }
  } catch (err) {
    console.error("Signature verification error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};






