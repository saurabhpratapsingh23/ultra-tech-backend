const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["USER", "BOT"] },
  text: String,
  language: String,
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const ChatbotConversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  aiRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "AIRequest" },
  messages: [MessageSchema],

  status: {
    type: String,
    enum: ["RESOLVED", "ESCALATED"],
    default: "RESOLVED"
  }

}, { timestamps: true });

module.exports = mongoose.model("ChatbotConversation", ChatbotConversationSchema);