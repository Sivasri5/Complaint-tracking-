const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mediaUrls: [String],
  tags: [String],
  status: {
    type: String,
    enum: ['open', 'resolved', 'closed', 'requeried'],
    default: 'open'
  },
  resolution: { type: mongoose.Schema.Types.ObjectId, ref: 'Resolution' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true }); // ✅ createdAt = complaint date

module.exports = mongoose.model('Complaint', complaintSchema);
