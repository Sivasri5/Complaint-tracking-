const express = require("express");
const {
  addConversation,
  getConversations,
} = require("../controllers/conversationController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// Add a new conversation
router.post("/", authenticate, addConversation);

// Get all conversations for a complaint
router.get("/:complaintId", authenticate, getConversations);

module.exports = router;
