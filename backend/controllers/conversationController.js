const Conversation = require("../models/Conversation");

const addConversation = async (req, res) => {
  try {
    const { complaintId, content } = req.body;
    const type = req.user.role === 'expert' ? 'reply' : 'query';

    const conversation = new Conversation({
      complaint: complaintId,
      content,
      author: req.user.id,
      type,
    });

    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      complaint: req.params.complaintId,
    }).populate("author");
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addConversation, getConversations };
