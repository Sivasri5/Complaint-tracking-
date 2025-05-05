const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

const isTwoFactorValidated = (req, res, next) => {
  if (req.user.twoFactorEnabled && !req.user.twoFactorValidated) {
    return res.status(403).json({ message: "2FA validation required." });
  }
  next();
};

const isExpert = (req, res, next) => {
  if (req.user.role !== "expert") {
    return res.status(403).json({ message: "Access denied. Experts only." });
  }
  next();
};

module.exports = { authenticate, isAdmin, isTwoFactorValidated, isExpert };
