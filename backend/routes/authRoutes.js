const express = require("express")
const {
  register,
  login,
  sendOtp,
  verifyOtp,
  approveExpert,
  validateTwoFactor,
  verifyToken, // Add this import
} = require("../controllers/authController")
const { authenticate } = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/send-otp", sendOtp)
router.post("/verify-otp", verifyOtp)
router.post("/approve-expert", authenticate, approveExpert)
router.post("/validate-2fa", authenticate, validateTwoFactor)
router.get("/me", authenticate, verifyToken) // Add this route
router.get("/verify", authenticate, verifyToken) // Add this route

module.exports = router
