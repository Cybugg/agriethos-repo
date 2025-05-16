const express = require("express");

const {createAdmin, createReviewer,adminLogin, getReviewersByAdmin} = require("../controllers/adminControllers");

const router = express.Router();

router.post("create/admin",createAdmin);
router.post("create/reviewer",createReviewer);
router.post('/login', adminLogin);
router.get('/by-admin/:adminId', getReviewersByAdmin);


module.exports = router;