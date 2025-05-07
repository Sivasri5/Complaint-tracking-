const Conversation = require("../models/Conversation")
const Complaint = require("../models/Complaint") // Add this import

const addConversation = async (req, res) => {
  try {
    const { complaintId, content, type } = req.body

    // Validate that the complaint exists
    const complaint = await Complaint.findById(complaintId)
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" })
    }

    // Only experts can reply
    if (type === "reply" && req.user.role !== "expert" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only experts can reply" })
    }

    const conversation = new Conversation({
      complaint: complaintId,
      content,
      author: req.user.id,
      type,
    })

    await conversation.save()

    // Populate the author field for the response
    await conversation.populate("author")

    res.status(201).json(conversation)
  } catch (error) {
    console.error("Error adding conversation:", error)
    res.status(500).json({ message: error.message })
  }
}

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      complaint: req.params.complaintId,
    }).populate("author")
    res.status(200).json(conversations)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getConversationsByComplaint = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      complaint: req.params.complaintId,
    })
      .populate("author")
      .sort({ createdAt: 1 })

    res.status(200).json(conversations)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  addConversation,
  getConversations,
  getConversationsByComplaint,
}
