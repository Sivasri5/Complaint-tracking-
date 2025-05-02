const express = require("express");
const { blockUser, unblockUser } = require("../controllers/adminController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin-only routes
router.post("/block-user", authenticate,isAdmin, blockUser); // Requires authentication
router.post("/unblock-user", authenticate,isAdmin, unblockUser); // Requires authentication

module.exports = router;
