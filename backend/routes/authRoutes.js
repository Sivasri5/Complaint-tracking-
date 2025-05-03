const express = require("express");
const { register, login, sendOtp, verifyOtp, approveExpert } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/approve-expert", authenticate, approveExpert); // Requires authentication

module.exports = router;
        