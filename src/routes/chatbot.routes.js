const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const controller = require("../controllers/chatbot.controller");

// POST /api/v1/chatbot/conversations (create new conversation)
router.post("/conversations", authMiddleware, controller.createConversation);

// GET /api/v1/chatbot/conversations (user's conversations)
router.get("/conversations", authMiddleware, controller.getUserConversations);

// GET /api/v1/chatbot/conversations/:conversationId
router.get("/conversations/:conversationId", authMiddleware, controller.getConversation);

// POST /api/v1/chatbot/conversations/:conversationId/messages (add message)
router.post(
  "/conversations/:conversationId/messages",
  authMiddleware,
  controller.addMessage
);

// POST /api/v1/chatbot/conversations/:conversationId/escalate (escalate to support)
router.post(
  "/conversations/:conversationId/escalate",
  authMiddleware,
  controller.escalateConversation
);

module.exports = router;


