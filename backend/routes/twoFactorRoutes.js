const express = require("express");
const { enableTwoFactor, verifyTwoFactor, disableTwoFactor } = require("../controllers/twoFactorController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/enable", authenticate, enableTwoFactor);
router.post("/verify", authenticate, verifyTwoFactor);
router.post("/disable", authenticate, disableTwoFactor);

module.exports = router;
