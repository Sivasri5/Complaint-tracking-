const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Model
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: {
      validator: (v) => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v),
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "expert", "admin"],
    required: true,
    index: true,
  },
  profile: {
    avatar: String,
    phone: {
      type: String,
      validate: {
        validator: (v) =>
          /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(v),
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
  },
  settings: {
    emailNotifications: { type: Boolean, default: true },
  },
  expertRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    set: (v) => Math.round(v * 10) / 10, // Store 1 decimal place
  },
  raisedComplaints: [
    {
      type: Schema.Types.ObjectId,
      ref: "Complaint",
      index: true,
    },
  ],
  blocked: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, index: true },
});

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
    enum: ["open", "in_progress", "closed"],
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
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, index: true },
});

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

ComplaintSchema.post("save", async function (complaint) {
  await User.findByIdAndUpdate(complaint.createdBy, {
    $addToSet: { raisedComplaints: complaint._id },
  });
});

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1, blocked: 1 });
UserSchema.index({ expertRating: -1 });

ComplaintSchema.index({ createdBy: 1, status: 1 });
ComplaintSchema.index({ assignedTo: 1, status: 1 });
ComplaintSchema.index({ tags: 1, status: 1 });

ConversationSchema.index({ complaint: 1, createdAt: -1 });

ReactionSchema.index({ conversation: 1, user: 1 }, { unique: true });

CommentSchema.index({ conversation: 1, createdAt: -1 });

// Models
const User = mongoose.model("User", UserSchema);
const Blocklist = mongoose.model("Blocklist", BlocklistSchema);
const Complaint = mongoose.model("Complaint", ComplaintSchema);
const Conversation = mongoose.model("Conversation", ConversationSchema);
const Reaction = mongoose.model("Reaction", ReactionSchema);
const Comment = mongoose.model("Comment", CommentSchema);

module.exports = {
  User,
  Blocklist,
  Complaint,
  Conversation,
  Reaction,
  Comment,
};
