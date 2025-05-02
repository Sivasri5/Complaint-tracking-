const express = require("express");
const {
  fetchAllUsers,
  blockUser,
  unblockUser,
} = require("../controllers/adminController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin-only routes
router.get("/users", authenticate, fetchAllUsers); // Requires authentication
router.post("/block-user", authenticate, blockUser); // Requires authentication
router.post("/unblock-user", authenticate, unblockUser); // Requires authentication

module.exports = router;
