const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Conversation Model
const ConversationSchema = new Schema({
    complaint: {
      type: Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
      index: true,
    },
    content: { type: String, required: true, trim: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["query", "reply"],
      default: "query",
      index: true,
    },
    reactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reaction",
        index: true,
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        index: true,
      },
    ],
    createdAt: { type: Date, default: Date.now, index: true },
  });
  
  // Middleware and Hooks
  ConversationSchema.pre("save", async function (next) {
    if (this.isNew) {
      await Complaint.findByIdAndUpdate(this.complaint, {
        $addToSet: { conversations: this._id },
        $set: { updatedAt: new Date() },
      });
    }
    next();
  });

  ConversationSchema.index({ complaint: 1, createdAt: -1 });

  const Conversation = mongoose.model("Conversation", ConversationSchema);

 module.exports = Conversation;
  