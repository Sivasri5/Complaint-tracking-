const mongoose = require('mongoose');

const blocklistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: String,
  blockedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Blocklist', blocklistSchema);
