const express = require("express");
const multer = require('multer');
const upload = multer(); // For parsing multipart/form-data

const {createAdmin, createReviewer,adminLogin, getReviewersByAdmin,verifySignature,getAdminOverview, getAllAdmins, getAllAgents, superCreate} = require("../controllers/adminControllers");

const router = express.Router();

router.post("/create/admin",upload.none(),createAdmin);
router.post("/create/agent",upload.none(),createReviewer);
router.get("/admins/:adminId",getAllAdmins);
router.get("/agents/:adminId",getAllAgents);
router.post("/create/reviewer",createReviewer);
router.post('/login', adminLogin);
router.get('/by-admin/:adminId', getReviewersByAdmin);
router.post("/super-create",superCreate)
// POST route for wallet-based login
router.post("/request-nonce", adminLogin);
router.post("/wallet-login", verifySignature);
// Overview - FIXED: Added missing slash before :adminId
router.get("/overview/:adminId", getAdminOverview);

module.exports = router;
