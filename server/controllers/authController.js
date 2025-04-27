const Farmer = require('../models/Farmer');
const {ethers} = require('ethers');

const generateNonce = () => Math.floor(Math.random() * 1000000).toString();


exports.requestNonce = async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: "Address required" });
  const timestamp = new Date().toISOString();

  let user = await Farmer.findOne({ walletAddress: address.toLowerCase()});

  if (!user) {
    user = new Farmer({ walletAddress: address.toLowerCase(), nonce: generateNonce() });
  } else {
    user.nonce = generateNonce(); // refresh nonce each time
  }
  user.last_transaction_stamp = timestamp;
  await user.save();
  res.json({ nonce: user.nonce ,timestamp:timestamp});
};


exports.verifySignature = async (req, res) => {

  // Get address and signature from the client
  const { address, signature } = req.body;

  // If any of the request field is missing -> return a bad request status
  if (!address || !signature) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Fetch user from the database 
  const user = await Farmer.findOne({ walletAddress: address.toLowerCase() });
  
  // If user is not on the database -> Return 404 cannot find status
  if (!user) return res.status(400).json({ error: "User not found" });

  // Mesage (Must align with the client's message)
  const message = `Welcome to AgriEthos 🌱

Sign this message to verify you own this wallet and authenticate securely.

Wallet Address: ${address}
Nonce: ${user.nonce}
Timestamp: ${user.last_transaction_stamp}

This request will not trigger a blockchain transaction or cost any gas.

Only sign this message if you trust AgriEthos.
  `;

  console.log(address,user.nonce,user.last_transaction_stamp);


  try {
    // verify the message
    const recovered = ethers.verifyMessage(message, signature);
    // If the the parsed address is same as the recovered
    if (recovered.toLowerCase() === address.toLowerCase()) {

      // Reset nonce to prevent reuse
      user.nonce = generateNonce();
   
      await user.save();

      return res.json({ success: true, message: "Wallet verified", data:{address,farmerId:user._id,newUser:user.newUser} });
    } else {
      return res.status(401).json({ error: "Signature verification failed" });
    }
  } catch (err) {
    console.error("Signature verification error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};