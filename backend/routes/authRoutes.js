const express = require("express");
const {
  register,
  login,
  sendOtp,
  verifyOtp,
  approveExpert,
  validateTwoFactor,
} = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/approve-expert", authenticate, approveExpert); // Requires authentication
router.post("/validate-2fa", authenticate, validateTwoFactor);

module.exports = router;
