const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  complaint: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', default: null },
  resolution: { type: mongoose.Schema.Types.ObjectId, ref: 'Resolution', default: null },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true }); // ✅ createdAt = comment time

module.exports = mongoose.model('Comment', commentSchema);
