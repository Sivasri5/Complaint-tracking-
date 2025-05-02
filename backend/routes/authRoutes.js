const express = require("express");
const { register, login, sendOtp, verifyOtp, approveExpert } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/send-otp", sendOtp);
router.post("/auth/verify-otp", verifyOtp);
router.post("/auth/approve-expert", authenticate, approveExpert); // Requires authentication

module.exports = router;
