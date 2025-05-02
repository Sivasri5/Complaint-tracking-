const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Replace this secret with your env variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// ✅ Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, profilePicture } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profilePicture,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.BlockedStatus.isBlocked)
      return res.status(401).json({ message: 'Unauthorized or blocked account' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Block or unblock a user (admin only)
exports.setBlockStatus = async (req, res) => {
  try {
    const { isBlocked, reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.BlockedStatus = {
      isBlocked,
      isBlockedreason: isBlocked ? reason : '',
      blockedAt: isBlocked ? new Date() : null,
    };

    await user.save();

    res.status(200).json({ message: `User ${isBlocked ? 'blocked' : 'unblocked'}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Verify expert (admin functionality)
exports.verifyExpert = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'expert') {
      return res.status(400).json({ message: 'User not found or not an expert' });
    }

    user.isVerifiedExpert = true;
    await user.save();

    res.status(200).json({ message: 'Expert verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
