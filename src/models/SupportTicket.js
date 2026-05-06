const mongoose = require("mongoose");

const SupportTicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  aiRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "AIRequest" },

  issueSummary: String,
  imageUrl: String,

  status: {
    type: String,
    enum: ["OPEN", "IN_PROGRESS", "RESOLVED"],
    default: "OPEN"
  }

}, { timestamps: true });

module.exports = mongoose.model("SupportTicket", SupportTicketSchema);