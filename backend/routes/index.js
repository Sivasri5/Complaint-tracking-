const express = require("express");

const {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
} = require("../controllers/complaintController");
const {
  addConversation,
  getConversations,
} = require("../controllers/conversationController");
const {
  addReaction,
  removeReaction,
} = require("../controllers/reactionController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// Auth routes


// Complaint routes
router.post("/complaints", authenticate, createComplaint);
router.get("/complaints", authenticate, getComplaints);
router.patch("/complaints/:id/status", authenticate, updateComplaintStatus);

// Conversation routes
router.post("/conversations", authenticate, addConversation);
router.get("/conversations/:complaintId", authenticate, getConversations);

// Reaction routes
router.post("/reactions", authenticate, addReaction);
router.delete("/reactions/:conversationId", authenticate, removeReaction);

