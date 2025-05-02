const { Reaction, Comment } = require("../models/Reaction");
const Conversation = require("../models/Conversation");

const addReaction = async (req, res) => {
  try {
    const { conversationId, type } = req.body;

    const reaction = new Reaction({
      conversation: conversationId,
      user: req.user.id,
      type,
    });

    await reaction.save();
    res.status(201).json(reaction);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Reaction already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

const removeReaction = async (req, res) => {
  try {
    const reaction = await Reaction.findOneAndDelete({
      conversation: req.params.conversationId,
      user: req.user.id,
    });

    if (!reaction) {
      return res.status(404).json({ message: "Reaction not found" });
    }

    res.status(200).json({ message: "Reaction removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    const comment = new Comment({
      conversation: conversationId,
      author: req.user.id,
      content,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReactions = async (req, res) => {
  try {
    const reactions = await Reaction.find({
      conversation: req.params.conversationId,
    });
    res.status(200).json(reactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      conversation: req.params.conversationId,
    }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsHelpful = async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.conversationId, type: "reply" },
      { $addToSet: { helpful: req.user.id } },
      { new: true }
    );

    if (!conversation) {
      return res
        .status(404)
        .json({
          message:
            "Conversation not found or not eligible to be marked as helpful",
        });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeHelpfulMark = async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.conversationId, type: "reply" },
      { $pull: { helpful: req.user.id } },
      { new: true }
    );

    if (!conversation) {
      return res
        .status(404)
        .json({
          message:
            "Conversation not found or not eligible to remove helpful mark",
        });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addReaction,
  removeReaction,
  addComment,
  getReactions,
  getComments,
  markAsHelpful,
  removeHelpfulMark,
};
