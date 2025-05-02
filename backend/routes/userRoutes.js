const express = require("express");
const {
  fetchUserById,
  fetchAllUsers,
} = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// User routes
router.get("/user/:userId", authenticate, fetchUserById); // Requires authentication
router.get("/users", authenticate, fetchAllUsers); // Requires authentication

module.exports = router;
