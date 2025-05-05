const express = require("express");
const {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  getComplaintDetails,
  updateComplaint,
} = require("../controllers/complaintController");
const {
  authenticate,
  isTwoFactorValidated,
  isExpert,
} = require("../middleware/authMiddleware");

const router = express.Router();
const authMiddleware = [authenticate, isTwoFactorValidated];
const expertMiddleware = [authenticate, isTwoFactorValidated, isExpert];

router.post("/", authMiddleware, createComplaint);
router.get("/", authMiddleware, getUserComplaints);
router.get("/all", authMiddleware, getAllComplaints);
router.get("/:id", authMiddleware, getComplaintDetails);
router.patch("/:id", expertMiddleware, updateComplaint);

module.exports = router;
