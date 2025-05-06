const express = require("express")
const {
  addReaction,
  removeReaction,
  addComment,
  getReactions,
  getComments,
  markAsHelpful,
  removeHelpfulMark,
} = require("../controllers/reactionController")
const { addConversation, getConversationsByComplaint } = require("../controllers/conversationController")
const { authenticate } = require("../middleware/authMiddleware")

const router = express.Router()

// Apply authentication middleware to all routes
router.use(authenticate)

// Reaction routes
router.post("/reactions", addReaction)
router.delete("/reactions/:conversationId", removeReaction)
router.post("/comments", addComment)
router.get("/:conversationId/reactions", getReactions)
router.get("/:conversationId/comments", getComments)
router.patch("/:conversationId/helpful", markAsHelpful)
router.delete("/:conversationId/helpful", removeHelpfulMark)

// Conversation routes
router.post("/conversations", addConversation)
router.get("/:complaintId/conversations", getConversationsByComplaint)

module.exports = router
