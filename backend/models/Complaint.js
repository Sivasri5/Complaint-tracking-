const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Complaint Model
const ComplaintSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ["open", "in_progress", "closed","resolved"],
    default: "open",
    index: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  conversations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      index: true,
    },
  ],
  tags: [{ type: String, index: true }],
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, index: true },
});

// Middleware and Hooks
ComplaintSchema.post("save", async function (complaint) {
  await User.findByIdAndUpdate(complaint.createdBy, {
    $addToSet: { raisedComplaints: complaint._id },
  });
});

ComplaintSchema.index({ createdBy: 1, status: 1 });
ComplaintSchema.index({ assignedTo: 1, status: 1 });
ComplaintSchema.index({ tags: 1, status: 1 });

const Complaint = mongoose.model("Complaint", ComplaintSchema);

module.exports = Complaint;
