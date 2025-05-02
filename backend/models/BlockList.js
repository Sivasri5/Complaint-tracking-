const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Blocklist Model
const BlocklistSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reason: String,
    blockedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, default: Date.now, index: true },
  });
  
const Blocklist = mongoose.model("Blocklist", BlocklistSchema);