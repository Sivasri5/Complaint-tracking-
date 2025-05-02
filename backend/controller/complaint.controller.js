const Complaint = require('../models/Comaplaint');

// Create a new complaint
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const userId = req.user._id; // assuming req.user is populated from auth middleware

    const complaint = new Complaint({
      title,
      description,
      tags,
      user: userId,
    });

    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ 'Deleted.isDeleted': false })
      .populate('user', 'name email') // populate user info
      .populate('resolution'); // populate resolution if needed

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ _id: req.params.id, 'Deleted.isDeleted': false })
      .populate('user', 'name email')
      .populate('resolution');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update complaint status or details
exports.updateComplaint = async (req, res) => {
  try {
    const updateData = req.body;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Soft delete a complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.Deleted.isDeleted = true;
    complaint.Deleted.DeletedAt = new Date();
    await complaint.save();

    res.status(200).json({ message: 'Complaint deleted (soft delete)' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
