const aiService = require("../services/ai.service");
const { successResponse, validationError, notFoundError, serverError, aiProviderError } = require("../utils/response");

// POST /api/v1/ai/diagnostics
exports.analyzeDiagnostics = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { userProblemText } = req.body;
    const imageFile = req.file; // From multer

    // Validation
    if (!userProblemText && !imageFile) {
      return validationError(res, "Either image or problem text is required");
    }

    // Analyze with AI service
    const result = await aiService.analyzeIssue(userId, userProblemText, imageFile);

    return successResponse(res, result, 200, "Diagnostic analysis completed");
  } catch (error) {
    if (error.message.includes("AI Analysis failed")) {
      return aiProviderError(res, error.message);
    }
    return serverError(res, error.message);
  }
};

// GET /api/v1/ai/diagnostics/:diagnosticId
exports.getDiagnostic = async (req, res) => {
  try {
    const { diagnosticId } = req.params;

    const diagnostic = await aiService.getAIRequestById(diagnosticId);

    return successResponse(res, diagnostic, 200, "Diagnostic retrieved successfully");
  } catch (error) {
    if (error.message.includes("not found")) {
      return notFoundError(res, error.message);
    }
    return serverError(res, error.message);
  }
};

// GET /api/v1/ai/history
exports.getDiagnosticHistory = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { page = 1, limit = 20 } = req.query;

    const result = await aiService.getUserAIRequestHistory(userId, page, limit);

    return successResponse(res, result, 200, "Diagnostic history retrieved");
  } catch (error) {
    return serverError(res, error.message);
  }
};
