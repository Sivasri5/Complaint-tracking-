const express = require("express");
const complaintRoutes = require("./routes/complaintRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const reactionRoutes = require("./routes/reactionRoutes");
const app = express();

// ...existing code...

app.use("/api/complaints", complaintRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/reactions", reactionRoutes);

// ...existing code...

module.exports = app;
