const Farmer = require('../models/Farmer');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const {ethers} = require('ethers');
require('dotenv').config();
const generateNonce = () => Math.floor(Math.random() * 1000000).toString();


exports.requestNonce = async (req, res) => {
  const {id} = req.params;

  
  const { address } = req.body;

if (!address) {
    return res.status(400).json({ success: false, message: 'Wallet address is required' });
  }
  const timestamp = new Date().toISOString();

  try {
    let user = await Farmer.findOne({ _id:id });

    if (!user) {
      return res.status(401).json("UNAUTHURIZED ACCESS")
    }
    else {
      user.nonce = generateNonce(); // refresh nonce each time
    }
    user.walletAddress = address;
  user.last_transaction_stamp = timestamp;
  
    console.log(timestamp);
  await user.save();

    return res.status(200).json({ success: true, data: user,nonce: user.nonce ,timestamp:timestamp});
  } catch (error) {
    console.error('User login error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};



exports.verifySignature = async (req, res) => {

  const {id} = req.params;

  // Get address and signature from the client
  const { address, signature } = req.body;

  // If any of the request field is missing -> return a bad request status
  if (!address || !signature) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Fetch user from the database 
  const user = await Farmer.findOne({ walletAddress: address.toLowerCase(), _id:id });
  
  // If user is not on the database -> Return 404 cannot find status
  if (!user) return res.status(400).json({ error: "user not found" });

  // Message (Must align with the client's message)
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
    console.log(recovered.toLowerCase());
    console.log(address.toLowerCase());
    // If the the parsed address is same as the recovered
    if (recovered.toLowerCase() === address.toLowerCase()) {

      // Reset nonce to prevent reuse
      user.nonce = generateNonce();
   
      await user.save();




      return res.json({ success: true, message: "Wallet verified", data:{user}});
    } else {
      return res.status(401).json({ error: "Signature verification failed" });
    }
  } catch (err) {
    console.error("Signature verification error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};









// Email related auth
//  Setup transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

exports.registerWithEmail = async (req,res) => {
  const { email, password, confirmPassword } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const verificationToken = uuidv4();

  // Let's check if all the body data are gotten
  if(!email || !password || !confirmPassword){
    return res.status(400).json({message:'Bad request from client'})
  }

  // Check if the password === confirmPassword (To be tested on the frontend and backend)
  if(password !== confirmPassword){
    return res.status(400).json({message:'Bad request from client'})
  }

  // Check if email already registered
  const existingUser = await Farmer.findOne({email:email});
  if(existingUser){
    return res.status(400).json({message:'Email already exits'})
  }


  const user = await Farmer.create({
    email,
    password: hashed,
    verificationToken,
  });

//   const link = `${process.env.CLIENT_URL}/verify?token=${verificationToken}`;

//   await transporter.sendMail({
//     from: process.env.EMAIL,
//     to: email,
//     subject: 'Verify your email',
//     html: `<!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//     <title>Email Verification</title>
//   </head>
//   <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
//     <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
//       <tr>
//         <td align="center">
//           <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
//             <tr>
//               <td style="padding: 30px;">
//                 <h2 style="color: #333333;">Verify Your Email</h2>
//                 <p style="color: #555555; font-size: 16px;">
//                   Thank you for signing up! Please click the button below to verify your email address.
//                 </p>
//                 <div style="text-align: center; margin: 30px 0;">
//                   <a href="{${link}}" target="_blank" style="background-color: #34a853; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">
//                     Verify Email
//                   </a>
//                 </div>
//                 <p style="color: #999999; font-size: 14px;">
//                   If you did not request this, please ignore this email.
//                 </p>
//               </td>
//             </tr>
//             <tr>
//               <td style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 13px; color: #888888;">
//                 &copy;2025 Agriethos. All rights reserved.
//               </td>
//             </tr>
//           </table>
//         </td>
//       </tr>
//     </table>
//   </body>
// </html>
// `,
//   });

  res.status(201).json({ success:true,message: 'User has beeen registered successfully',data:{email:user.email} });
};

// verify email
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  const user = await Farmer.findOne({ verificationToken: token });
  if (!user) return res.status(400).send('Invalid token');

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.status(200).json({message:'Email verified successfully'});
}
// Login with email after it has been verified
exports.loginWithEmail = async (req, res) => {
  const { email, password } = req.body;

  // To do some checkings
  if(!email || !password){
  return res.status(400).json({ error: 'Incomplete credentials' });
  }

  const user = await Farmer.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ error: 'Invalid credentials' });

  // if (!user.isVerified)
    // return res.status(403).json({ error: 'Email not verified' });

  // At this point, you can set session or token (skip JWT for now)
  res.json({ success:true,message: 'User has logged-in successfully',data:{email:user.email,farmerId:user._id,newUser:user.newUser,userPack:user} });
}

// reverify email
exports.resendReverification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await Farmer.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified.' });
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 1000 * 60 * 15; // 15 minutes
    await user.save();

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${user.email}`;

    // Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your SMTP service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const link = `${process.env.CLIENT_URL}/verify?token=${verificationToken}`;
    const mailOptions = {
      from: `"AgriEthos" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Resend Email Verification',
      html: `
        <div style="font-family:sans-serif;padding:20px;background:#fff;color:#111">
          <h2 style="color:green;">Verify Your Email</h2>
          <p>Click the link below to verify your email address:</p>
          <a href="${link}" style="padding:10px 15px;background-color:green;color:#fff;text-decoration:none;border-radius:5px;">Verify Email</a>
          <p>This link will expire in 15 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Verification email resent.' });

  } catch (error) {
    console.error('Error resending verification email:', error);
    return res.status(500).json({ message: 'Something Went Wrong.' });
  }
};



exports.changePassword = async (req,res)=>{
  // Get user ID for verification and update
  const {id}= req.params;
  // Get new-password and previous-password
  const {newPassword,prevPassword} = req.body;

  // input validation
  if(!newPassword || !prevPassword){
    return res.status(400).json({message:"Invalid Credentials"})
  }
   // input validation
   if(newPassword === prevPassword){
    return res.status(400).json({message:"new password is the same with the old password"})
  }

  //check if user exists
  try{
    const user = await Farmer.findOne({_id:id});
    if(!user){
      return res.status(404).json({message:"Cannot Find User"})
    }
    // Verify prev password
    const passAuthentic = await bcrypt.compare(prevPassword,user.password);
    if(!passAuthentic){
      return res.status(400).json({message:"Wrong Previous Password"})
    }
    user.password = await bcrypt.hash(newPassword,10);
    await user.save();
    return res.status(200).json({message:"Password Updated"})
  }
  catch(err){

    return res.status(500).json({message:"Internal Server Error"})
  }
  
  
}