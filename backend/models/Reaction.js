const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Reaction Model
const ReactionSchema = new Schema({
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["like", "helpful", "not_helpful"],
      required: true,
      index: true,
    },
    createdAt: { type: Date, default: Date.now, index: true },
  });
  
  // Comment Model
  const CommentSchema = new Schema({
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now, index: true },
  });
  
ReactionSchema.index({ conversation: 1, user: 1 }, { unique: true });

CommentSchema.index({ conversation: 1, createdAt: -1 });

const Reaction = mongoose.model("Reaction", ReactionSchema);
const Comment = mongoose.model("Comment", CommentSchema);

module.exports = { Reaction, Comment };
