const mongoose = require('mongoose');

const resolutionSchema = new mongoose.Schema({
  complaint: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  mediaUrls: [String],
  tags: [String],
  helpfulCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  isClosed: { type: Boolean, default: false }
}, { timestamps: true }); // ✅ createdAt = when resolution was posted

module.exports = mongoose.model('Resolution', resolutionSchema);
