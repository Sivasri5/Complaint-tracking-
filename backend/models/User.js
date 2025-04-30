const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'expert', 'admin'], default: 'user' },
  profilePicture: String,
  bio: String,
  location: String,

  // ✅ Expert-specific fields
  expertiseTags: [{ type: String }],
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  isVerifiedExpert: { type: Boolean, default: false }, // 👈 New Field

  // ✅ Common fields
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  emailNotifications: { type: Boolean, default: true },
  loginAttempts: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  lastLoginAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
