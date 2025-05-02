const express = require("express");
const { fetchUserById } = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// User routes
router.get("/user/:userId", authenticate, fetchUserById); // Requires authentication

module.exports = router;
