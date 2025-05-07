const express = require("express")
const {
  createComplaint,
  getComplaints,
  getAllComplaints,
  getComplaintDetails,
  updateComplaint,
} = require("../controllers/complaintController")
const { authenticate, isTwoFactorValidated } = require("../middleware/authMiddleware")

const router = express.Router()

// Apply authentication middleware to all routes
router.use(authenticate)
router.use(isTwoFactorValidated)

router.post("/", createComplaint)
router.get("/", getComplaints)
router.get("/all", getAllComplaints)
router.get("/:id", getComplaintDetails)
router.patch("/:id", updateComplaint)

module.exports = router
