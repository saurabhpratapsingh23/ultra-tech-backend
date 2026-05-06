const ChatbotConversation = require("../models/ChatbotConversation");
const AIRequest = require("../models/AIRequest");
const Product = require("../models/Product");
const SupportTicket = require("../models/SupportTicket");

class ChatbotService {
  // Start or get conversation
  async getOrCreateConversation(userId, aiRequestId = null) {
    let conversation = null;

    if (aiRequestId) {
      conversation = await ChatbotConversation.findOne({
        userId,
        aiRequestId,
      });
    }

    if (!conversation) {
      conversation = new ChatbotConversation({
        userId,
        aiRequestId: aiRequestId || null,
        messages: [],
        status: "RESOLVED",
      });

      await conversation.save();
    }

    return conversation;
  }

  // Add message to conversation
  async addMessage(conversationId, sender, text, language = "en") {
    const conversation = await ChatbotConversation.findById(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    conversation.messages.push({
      sender,
      text,
      language,
      timestamp: new Date(),
    });

    await conversation.save();

    return conversation;
  }

  // Get conversation by ID
  async getConversationById(conversationId) {
    const conversation = await ChatbotConversation.findById(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    return conversation;
  }

  // Get all conversations for user
  async getUserConversations(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const total = await ChatbotConversation.countDocuments({ userId });
    const conversations = await ChatbotConversation.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      items: conversations,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  }

  // Escalate conversation to support
  async escalateToSupport(conversationId) {
    const conversation = await ChatbotConversation.findByIdAndUpdate(
      conversationId,
      { status: "ESCALATED" },
      { new: true }
    );

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    return conversation;
  }

  // Get solution for issue
  async getSolution(aiResult) {
    if (!aiResult) return null;

    const product = await Product.findOne({
      categoryKey: aiResult.category,
      subCategoryKey: aiResult.subCategory,
      isActive: true,
    });

    return product;
  }

  // Create support ticket
  async createSupportTicket(userId, aiRequestId, text, imageUrl = null) {
    return await SupportTicket.create({
      userId,
      aiRequestId,
      issueSummary: text,
      imageUrl,
    });
  }

  // TODO: Implement AI response generation
  // This would integrate with your AI service or third-party API
  async generateAIResponse(userMessage, language = "en") {
    // Placeholder for AI response generation
    // In production, integrate with ChatGPT, Claude, or your FastAPI service
    return {
      text: "I'm here to help! Can you provide more details about your issue?",
      language,
    };
  }
}

module.exports = new ChatbotService();