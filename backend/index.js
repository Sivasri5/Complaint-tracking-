const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const morgan = require("morgan")

const userRoutes = require("./routes/userRoutes")
const reactionRoutes = require("./routes/reactionRoutes")
const complaintRoutes = require("./routes/complaintRoutes")
const authRoutes = require("./routes/authRoutes")
const adminRoutes = require("./routes/adminRoutes")
const twoFactorRoutes = require("./routes/twoFactorRoutes")

dotenv.config()

const app = express()

// Middleware
app.use(cors()) // Enable CORS
app.use(express.json()) // Parse JSON request bodies
app.use(morgan("dev")) // Logging middleware

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/complaint-tracking")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/users", userRoutes)
app.use("/api/reactions", reactionRoutes)
app.use("/api/complaints", complaintRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/2fa", twoFactorRoutes) // Add 2FA routes

// Default route
app.get("/", (req, res) => {
  res.send("Complaint Tracking API is running...")
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})