const speakeasy = require("speakeasy");

const enableTwoFactor = async (req, res) => {
  try {
    const user = req.user;

    if (user.twoFactorEnabled) {
      return res.status(400).json({ message: "2FA is already enabled." });
    }
    

    const secret = speakeasy.generateSecret();
    user.twoFactorSecret = secret.base32;
    await user.save();

    res.status(200).json({
      message: "2FA enabled successfully.",
      otpBase32: secret.base32,
      otpUrl: secret.otpauth_url,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyTwoFactor = async (req, res) => {
  try {
    const { token } = req.body;
    const user = req.user;
    // Ensure the 2FA secret exists
    if (!user.twoFactorSecret) {
    return res.status(500).json({
        message:
        "2FA is enabled, but no secret is configured. Contact support.",
    });
    }
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });

    if (!isValid) {
        user.twoFactorValidated = false; // Mark as invalid
        await user.save();
        return res.status(400).json({ message: "Invalid 2FA token." });
    }

    user.twoFactorEnabled = true;
    user.twoFactorValidated = true; // Mark as validated
    await user.save();

    res.status(200).json({ message: "2FA verified and enabled successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const disableTwoFactor = async (req, res) => {
  try {
    const user = req.user;

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: "2FA is not enabled." });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    user.twoFactorValidated = false;
    await user.save();

    res.status(200).json({ message: "2FA disabled successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { enableTwoFactor, verifyTwoFactor, disableTwoFactor };
