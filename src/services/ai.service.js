const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const { AI_SERVICE_CONFIG } = require("../config/constants");
const AIRequest = require("../models/AIRequest");
const Product = require("../models/Product");
const SupportTicket = require("../models/SupportTicket");

class AIService {
  // Analyze issue with image and/or text
  async analyzeIssue(userId, userProblemText, imageFile = null) {
    try {
      // Create FormData for multipart request
      const form = new FormData();

      if (userProblemText) {
        form.append("text", userProblemText);
      }

      if (imageFile) {
        form.append(
          "file",
          fs.createReadStream(imageFile.path),
          imageFile.filename
        );
      }

      // Call Python FastAPI service
      const aiResponse = await axios.post(
        `${AI_SERVICE_CONFIG.BASE_URL}${AI_SERVICE_CONFIG.ANALYZE_ENDPOINT}`,
        form,
        {
          headers: form.getHeaders(),
          timeout: AI_SERVICE_CONFIG.TIMEOUT,
        }
      );

      // Extract AI analysis
      const {
        category,
        subcategory,
        issue_type,
        confidence_score,
        reasoning,
      } = aiResponse.data;

      // Save AI Request to database
      const aiRequest = new AIRequest({
        userId,
        inputType: imageFile ? (userProblemText ? "IMAGE+TEXT" : "IMAGE") : "TEXT",
        imageUrl: imageFile ? `/uploads/${imageFile.filename}` : null,
        userProblemText,
        detectedCategory: category,
        detectedSubCategory: subcategory,
        detectedIssueType: issue_type,
        confidenceScore: confidence_score,
        aiModelVersion: "1.0", // TODO: Update with actual model version
        status: "COMPLETED",
      });

      await aiRequest.save();

      // Try to find matching product
      const matchedProduct = await Product.findOne({
        categoryKey: category,
        subCategoryKey: subcategory,
        isActive: true,
      });

      if (matchedProduct) {
        aiRequest.matchFound = true;
        await aiRequest.save();

        return {
          success: true,
          issue: issue_type,
          severity: this.calculateSeverity(confidence_score),
          recommendation: {
            productId: matchedProduct._id,
            name: matchedProduct.displayName,
            description: matchedProduct.description,
            applicationSteps: matchedProduct.applicationSteps,
            marketPrice: matchedProduct.marketPrice,
            buyLink: matchedProduct.buyLink,
            images: matchedProduct.images,
          },
          reasoning,
          diagnosticId: aiRequest._id,
        };
      } else {
        // No product match - create support ticket for escalation
        const supportTicket = new SupportTicket({
          userId,
          aiRequestId: aiRequest._id,
          issueSummary: `${issue_type} - ${reasoning}`,
          imageUrl: aiRequest.imageUrl,
          status: "OPEN",
        });

        await supportTicket.save();

        aiRequest.matchFound = false;
        await aiRequest.save();

        return {
          success: true,
          issue: issue_type,
          severity: this.calculateSeverity(confidence_score),
          reasoning,
          escalated: true,
          supportTicketId: supportTicket._id,
          message:
            "No matching product found. Your issue has been escalated to our support team.",
          diagnosticId: aiRequest._id,
        };
      }
    } catch (error) {
      console.error("AI Service Error:", error.message);

      // Save failed AI request
      const aiRequest = new AIRequest({
        userId,
        inputType: imageFile ? (userProblemText ? "IMAGE+TEXT" : "IMAGE") : "TEXT",
        imageUrl: imageFile ? `/uploads/${imageFile.filename}` : null,
        userProblemText,
        status: "FAILED",
      });

      await aiRequest.save();

      throw new Error(`AI Analysis failed: ${error.message}`);
    }
  }

  // Calculate severity from confidence score
  calculateSeverity(confidenceScore) {
    if (confidenceScore >= 0.8) return "High";
    if (confidenceScore >= 0.5) return "Medium";
    return "Low";
  }

  // Get AI request history for user
  async getUserAIRequestHistory(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const total = await AIRequest.countDocuments({ userId });
    const requests = await AIRequest.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      items: requests,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  }

  // Get AI request by ID
  async getAIRequestById(requestId) {
    const request = await AIRequest.findById(requestId);

    if (!request) {
      throw new Error("AI request not found");
    }

    return request;
  }
}

module.exports = new AIService();