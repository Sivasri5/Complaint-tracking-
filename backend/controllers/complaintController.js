const Complaint = require("../models/Complaint")

const createComplaint = async (req, res) => {
  try {
    const { title, description, userId } = req.body // accept userId from body for testing
    console.log("Received complaint:", { title, description, userId }) // Logging for debugging

    // Use req.user if available, otherwise fallback to the sent userId
    const complaint = new Complaint({
      title,
      description,
      createdBy: req.user ? req.user.id : userId,
    })

    await complaint.save()
    console.log("Complaint created:", complaint) // Log the created complaint for debugging
    res.status(201).json(complaint)
  } catch (error) {
    console.error("Error creating complaint:", error) // Log the real error for debugging
    res.status(500).json({ message: error.message })
  }
}

const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      createdBy: req.user.id,
    }).populate("assignedTo")
    res.status(200).json(complaints)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({}, "title status createdAt updatedAt")
    res.status(200).json(complaints)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getComplaintDetails = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("conversations")
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" })
    }
    res.status(200).json(complaint)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateComplaint = async (req, res) => {
  try {
    const { status, tag } = req.body
    const updateFields = {}

    if (status) updateFields.status = status
    if (tag) updateFields.$addToSet = { tags: tag }

    const complaint = await Complaint.findByIdAndUpdate(req.params.id, updateFields, { new: true })

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" })
    }

    res.status(200).json(complaint)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createComplaint,
  getComplaints,
  getAllComplaints,
  getComplaintDetails,
  updateComplaint,
}
