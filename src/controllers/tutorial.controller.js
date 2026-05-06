const Tutorial = require("../models/Tutorial");
const { successResponse, validationError, notFoundError, serverError } = require("../utils/response");

// GET /api/v1/tutorials
exports.getTutorials = async (req, res) => {
  try {
    const { categoryKey, search } = req.query;

    const query = { isActive: true };

    if (categoryKey) {
      query.categoryKey = categoryKey;
    }

    if (search) {
      query.$or = [
        { "title.en": { $regex: search, $options: "i" } },
        { "title.hi": { $regex: search, $options: "i" } },
        { "description.en": { $regex: search, $options: "i" } },
        { "description.hi": { $regex: search, $options: "i" } },
      ];
    }

    const tutorials = await Tutorial.find(query).sort({ createdAt: -1 });

    return successResponse(res, { tutorials }, 200, "Tutorials retrieved successfully");
  } catch (err) {
    return serverError(res, err.message);
  }
};

// GET /api/v1/tutorials/:tutorialId
exports.getTutorialById = async (req, res) => {
  try {
    const { tutorialId } = req.params;

    const tutorial = await Tutorial.findById(tutorialId);

    if (!tutorial || !tutorial.isActive) {
      return notFoundError(res, "Tutorial not found");
    }

    return successResponse(res, tutorial, 200, "Tutorial retrieved successfully");
  } catch (err) {
    return serverError(res, err.message);
  }
};

// Admin: CREATE TUTORIAL
exports.createTutorial = async (req, res) => {
  try {
    const { title, categoryKey, videoUrl, duration, thumbnailUrl, description } = req.body;

    if (!title || !categoryKey || !videoUrl) {
      return validationError(res, "Title, categoryKey, and videoUrl are required");
    }

    const tutorial = new Tutorial({
      title,
      categoryKey,
      videoUrl,
      duration,
      thumbnailUrl,
      description,
    });

    await tutorial.save();

    return successResponse(res, tutorial, 201, "Tutorial created successfully");
  } catch (err) {
    return serverError(res, err.message);
  }
};

// Admin: UPDATE TUTORIAL
exports.updateTutorial = async (req, res) => {
  try {
    const { tutorialId } = req.params;
    const data = req.body;

    const tutorial = await Tutorial.findByIdAndUpdate(tutorialId, data, {
      new: true,
      runValidators: true,
    });

    if (!tutorial) {
      return notFoundError(res, "Tutorial not found");
    }

    return successResponse(res, tutorial, 200, "Tutorial updated successfully");
  } catch (err) {
    return serverError(res, err.message);
  }
};

// Admin: DELETE TUTORIAL (soft delete)
exports.deleteTutorial = async (req, res) => {
  try {
    const { tutorialId } = req.params;

    const tutorial = await Tutorial.findByIdAndUpdate(
      tutorialId,
      { isActive: false },
      { new: true }
    );

    if (!tutorial) {
      return notFoundError(res, "Tutorial not found");
    }

    return successResponse(res, { message: "Tutorial deleted successfully" }, 200);
  } catch (err) {
    return serverError(res, err.message);
  }
};
