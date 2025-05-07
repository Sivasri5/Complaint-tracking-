const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const crypto = require("crypto")
const sendEmail = require("../utils/emailUtil")
const fs = require("fs").promises
const path = require("path")
const speakeasy = require("speakeasy")

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Validate role against User model's enum
    if (!["customer", "expert"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
      name,
      email,
      passwordHash: hashedPassword,
      role,
    })

    await user.save()
    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    // Check if user exists, role is valid, and user is not blocked
    if (!user || !["customer", "expert", "admin"].includes(user.role) || user.blocked) {
      return res.status(401).json({ message: "Invalid credentials or user is blocked" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    })

    if (user.twoFactorEnabled) {
      user.twoFactorValidated = false // Mark 2FA as invalid
      await user.save()
    }

    // If 2FA is not enabled, just send the token
    res.status(200).json({ token, twoFactorEnabled: user.twoFactorEnabled })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const otp = crypto.randomInt(100000, 999999).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    user.verification.otp = otp
    user.verification.otpExpiry = otpExpiry
    await user.save()

    // Read HTML template
    const templatePath = path.join(__dirname, "../templates/otpEmail.html")
    let emailTemplate = await fs.readFile(templatePath, "utf8")
    emailTemplate = emailTemplate.replace("{{otp}}", otp)

    // Send styled OTP via email
    await sendEmail(email, "Your OTP Code", emailTemplate, true)

    res.status(200).json({ message: "OTP sent successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body
    const user = await User.findOne({ email })

    if (!user || user.verification.otp !== otp || user.verification.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" })
    }

    user.verification.emailVerified = true
    user.verification.otp = null
    user.verification.otpExpiry = null
    await user.save()

    res.status(200).json({ message: "Email verified successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const approveExpert = async (req, res) => {
  try {
    const { userId } = req.body

    const user = await User.findById(userId)
    if (!user || user.role !== "expert") {
      return res.status(404).json({ message: "Expert not found" })
    }

    user.verification.adminApproved = true
    await user.save()

    res.status(200).json({ message: "Expert approved successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const validateTwoFactor = async (req, res) => {
  try {
    const { token } = req.body
    const user = req.user

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: "2FA is not enabled." })
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    })

    if (!isValid) {
      return res.status(400).json({ message: "Invalid 2FA token." })
    }

    user.twoFactorValidated = true
    await user.save()

    res.status(200).json({ message: "2FA validated successfully." })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const verifyToken = async (req, res) => {
  try {
    // If the middleware passed, the token is valid and req.user is set
    const user = await User.findById(req.user.id).select("-passwordHash")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  register,
  login,
  sendOtp,
  verifyOtp,
  approveExpert,
  validateTwoFactor,
  verifyToken,
}
