const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Model
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: {
      validator: (v) => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v),
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "expert", "admin"],
    required: true,
    index: true,
  },
  profile: {
    avatar: String,
    phone: {
      type: String,
      validate: {
        validator: (v) =>
          /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(v),
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
  },
  settings: {
    emailNotifications: { type: Boolean, default: true },
  },
  expertRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    set: (v) => Math.round(v * 10) / 10, // Store 1 decimal place
  },
  raisedComplaints: [
    {
      type: Schema.Types.ObjectId,
      ref: "Complaint",
      index: true,
    },
  ],
  blocked: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, index: true },
  verification: {
    emailVerified: { type: Boolean, default: false },
    otp: { type: String }, // Store OTP for email verification
    otpExpiry: { type: Date }, // Expiry time for OTP
    adminApproved: { type: Boolean, default: false }, // Admin approval for experts
  },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String }, // Secret for 2FA
  twoFactorValidated: { type: Boolean, default: false },
});

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1, blocked: 1 });
UserSchema.index({ expertRating: -1 });

const User = mongoose.model("User", UserSchema);

module.exports = User;
