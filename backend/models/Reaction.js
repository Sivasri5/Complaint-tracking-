const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['like', 'heart', 'thumbs-up', 'fire', 'clap'],
    required: true
  },
  complaint: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', default: null },
  resolution: { type: mongoose.Schema.Types.ObjectId, ref: 'Resolution', default: null }
}, { timestamps: true }); // ✅ createdAt = reaction time

module.exports = mongoose.model('Reaction', reactionSchema);
