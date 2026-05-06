const chatbotService = require("../services/chatbot.service");
const { successResponse, validationError, notFoundError, serverError } = require("../utils/response");

// POST /api/v1/chatbot/conversations (create new conversation)
exports.createConversation = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { aiRequestId } = req.body;

    const conversation = await chatbotService.getOrCreateConversation(userId, aiRequestId);

    return successResponse(res, conversation, 201, "Conversation created");
  } catch (error) {
    return serverError(res, error.message);
  }
};

// GET /api/v1/chatbot/conversations/:conversationId
exports.getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await chatbotService.getConversationById(conversationId);

    return successResponse(res, conversation, 200, "Conversation retrieved");
  } catch (error) {
    if (error.message.includes("not found")) {
      return notFoundError(res, error.message);
    }
    return serverError(res, error.message);
  }
};

// GET /api/v1/chatbot/conversations (user's conversations)
exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { page = 1, limit = 20 } = req.query;

    const result = await chatbotService.getUserConversations(userId, page, limit);

    return successResponse(res, result, 200, "Conversations retrieved");
  } catch (error) {
    return serverError(res, error.message);
  }
};

// POST /api/v1/chatbot/conversations/:conversationId/messages (add message)
exports.addMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text, language = "en" } = req.body;

    if (!text || !text.trim()) {
      return validationError(res, "Message text is required");
    }

    // Add user message
    let conversation = await chatbotService.addMessage(
      conversationId,
      "USER",
      text,
      language
    );

    // Generate AI response
    const aiResponse = await chatbotService.generateAIResponse(text, language);

    // Add bot response
    conversation = await chatbotService.addMessage(
      conversationId,
      "BOT",
      aiResponse.text,
      aiResponse.language
    );

    return successResponse(res, conversation, 200, "Message added and response generated");
  } catch (error) {
    if (error.message.includes("not found")) {
      return notFoundError(res, error.message);
    }
    return serverError(res, error.message);
  }
};

// POST /api/v1/chatbot/conversations/:conversationId/escalate
exports.escalateConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await chatbotService.escalateToSupport(conversationId);

    return successResponse(res, conversation, 200, "Conversation escalated to support");
  } catch (error) {
    if (error.message.includes("not found")) {
      return notFoundError(res, error.message);
    }
    return serverError(res, error.message);
  }
};
      userProblemText: text
    });

    // 3️⃣ Call REAL AI SERVICE
    const aiResult = await analyzeIssue({ text, imageUrl });

    let responseText = "";
    let status = "RESOLVED";

    // 4️⃣ AI RESULT PROCESSING
    if (aiResult && aiResult.category) {
      aiRequest.detectedCategory = aiResult.category;
      aiRequest.detectedSubCategory = aiResult.subCategory;
      aiRequest.confidenceScore = aiResult.confidence;

      // 5️⃣ Find product
      const product = await getSolution(aiResult);

      if (product) {
        aiRequest.matchFound = true;

        // 🌐 Language handling
        if (user.preferredLanguage === "hi") {
          responseText = `आपके लिए उपयुक्त उत्पाद: ${product.displayName.hi}`;
        } else {
          responseText = `Recommended product: ${product.displayName.en}`;
        }

      } else {
        // ❌ No product match → escalation
        aiRequest.matchFound = false;
        status = "ESCALATED";

        await createSupportTicket(userId, aiRequest, text, imageUrl);

        responseText =
          user.preferredLanguage === "hi"
            ? "आपकी समस्या दर्ज कर ली गई है। 48 घंटे में संपर्क किया जाएगा।"
            : "Your query has been registered. We will contact you within 48 hours.";
      }

    } else {
      // ❌ AI failed → escalation
      status = "ESCALATED";

      await createSupportTicket(userId, aiRequest, text, imageUrl);

      responseText =
        user.preferredLanguage === "hi"
          ? "आपकी समस्या दर्ज कर ली गई है।"
          : "Your query has been registered.";
    }

    // 6️⃣ Save AI request
    aiRequest.status = "COMPLETED";
    await aiRequest.save();

    // 7️⃣ Save conversation
    const conversation = await ChatbotConversation.create({
      userId,
      aiRequestId: aiRequest._id,
      status,
      messages: [
        {
          sender: "USER",
          text,
          language: user.preferredLanguage
        },
        {
          sender: "BOT",
          text: responseText,
          language: user.preferredLanguage
        }
      ]
    });

    // 8️⃣ Final response
    res.json({
      message: responseText,
      conversationId: conversation._id,
      ai: aiResult || null
    });

  } catch (err) {
    console.error("Chatbot Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};