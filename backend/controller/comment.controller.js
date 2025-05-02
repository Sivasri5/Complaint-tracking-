const Comment = require('../models/Comment');

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const comment = new Comment(req.body);
    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all comments (optionally filter by complaint or resolution)
exports.getComments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.complaint) filter.complaint = req.query.complaint;
    if (req.query.resolution) filter.resolution = req.query.resolution;

    const comments = await Comment.find(filter)
      .populate('author', 'name email')
      .populate('complaint')
      .populate('resolution');
      
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific comment by ID
exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('author', 'name email')
      .populate('complaint')
      .populate('resolution');

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    res.status(200).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Soft delete a comment (isDeleted = true)
exports.deleteComment = async (req, res) => {
  try {
    const deleted = await Comment.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!deleted) return res.status(404).json({ error: 'Comment not found' });

    res.status(200).json({ message: 'Comment marked as deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a comment's text
exports.updateComment = async (req, res) => {
  try {
    const updated = await Comment.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Comment not found' });

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
