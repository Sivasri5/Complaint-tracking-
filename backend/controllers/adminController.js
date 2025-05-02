const User = require("../models/User");

// Block a user (admin only)
const blockUser = async (req, res) => {


  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.blocked = true;
    await user.save();

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unblock a user (admin only)
const unblockUser = async (req, res) => {

  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.blocked = false;
    await user.save();

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { blockUser, unblockUser };
