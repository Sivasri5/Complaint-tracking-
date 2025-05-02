const express = require("express");
const {
  addReaction,
  removeReaction,
  addComment,
  getReactions,
  getComments,
  markAsHelpful,
  removeHelpfulMark,
} = require("../controllers/reactionController");

const router = express.Router();

router.post("/reactions", addReaction);
router.delete("/reactions/:conversationId", removeReaction);
router.post("/comments", addComment);
router.get("/:conversationId/reactions", getReactions);
router.get("/:conversationId/comments", getComments);
router.patch("/:conversationId/helpful", markAsHelpful);
router.delete("/:conversationId/helpful", removeHelpfulMark);

module.exports = router;
