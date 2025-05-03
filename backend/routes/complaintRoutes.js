const express = require("express");
const {
  createComplaint,
  getComplaints,
  getAllComplaints,
  getComplaintDetails,
  updateComplaint,
} = require("../controllers/complaintController");

const router = express.Router();

router.post("/", createComplaint);
router.get("/", getComplaints);
router.get("/all", getAllComplaints);
router.get("/:id", getComplaintDetails);
router.patch("/:id", updateComplaint);

module.exports = router;
