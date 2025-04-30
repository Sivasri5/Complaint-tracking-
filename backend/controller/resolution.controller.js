const Resolution = require('../models/Resolution');
const Complaint = require('../models/Complaint');

// Create a resolution for a complaint
exports.createResolution = async (req, res) => {
  try {
    const { complaint, content, mediaUrls, tags } = req.body;
    const expertId = req.user._id; // Auth middleware should provide this

    // Optional: Validate that the complaint exists and is open
    const existingComplaint = await Complaint.findById(complaint);
    if (!existingComplaint || existingComplaint.status !== 'open') {
      return res.status(400).json({ message: 'Invalid or closed complaint' });
    }

    const resolution = new Resolution({
      complaint,
      expert: expertId,
      content,
      mediaUrls,
      tags,
    });

    const saved = await resolution.save();

    // Optionally link the resolution to the complaint
    existingComplaint.resolution = saved._id;
    existingComplaint.status = 'resolved';
    await existingComplaint.save();

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all resolutions
exports.getAllResolutions = async (req, res) => {
  try {
    const resolutions = await Resolution.find()
      .populate('expert', 'name email')
      .populate('complaint', 'title');

    res.status(200).json(resolutions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single resolution by ID
exports.getResolutionById = async (req, res) => {
  try {
    const resolution = await Resolution.findById(req.params.id)
      .populate('expert', 'name email')
      .populate('complaint', 'title');

    if (!resolution) {
      return res.status(404).json({ message: 'Resolution not found' });
    }

    res.status(200).json(resolution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a resolution (content, tags, etc.)
exports.updateResolution = async (req, res) => {
  try {
    const updateData = req.body;

    const updated = await Resolution.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Resolution not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mark resolution as closed
exports.closeResolution = async (req, res) => {
  try {
    const resolution = await Resolution.findById(req.params.id);
    if (!resolution) {
      return res.status(404).json({ message: 'Resolution not found' });
    }

    resolution.isClosed = true;
    await resolution.save();

    res.status(200).json({ message: 'Resolution closed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
