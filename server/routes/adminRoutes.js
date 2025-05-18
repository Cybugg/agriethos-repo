const express = require("express");
const multer = require('multer');
const upload = multer(); // For parsing multipart/form-data

const {createAdmin, createReviewer,adminLogin, getReviewersByAdmin,verifySignature,getAdminOverview, getAllAdmins} = require("../controllers/adminControllers");

const router = express.Router();

router.post("/create/admin",upload.none(),createAdmin);
router.get("/admins/:adminId",getAllAdmins);
router.post("/create/reviewer",createReviewer);
router.post('/login', adminLogin);
router.get('/by-admin/:adminId', getReviewersByAdmin);
// POST route for wallet-based login
router.post("/request-nonce", adminLogin);
router.post("/wallet-login", verifySignature);
// Overview
router.get("/overview",getAdminOverview);

module.exports = router;