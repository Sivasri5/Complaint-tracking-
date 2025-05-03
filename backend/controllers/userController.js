const User = require("../models/User");

// Fetch user by ID (accessible to all authenticated users)
const fetchUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-passwordHash"); // Exclude passwordHash
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all users (accessible to all authenticated users)
const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash"); // Exclude passwordHash
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { fetchUserById, fetchAllUsers };
