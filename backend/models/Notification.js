const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  link: String,
  isRead: { type: Boolean, default: false }
}, { timestamps: true }); // ✅ createdAt = when notification was triggered

module.exports = mongoose.model('Notification', notificationSchema);
