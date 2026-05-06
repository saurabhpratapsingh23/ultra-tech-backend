const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { UPLOAD_CONFIG } = require("../config/constants");

// Ensure uploads directory exists
const uploadDir = UPLOAD_CONFIG.UPLOAD_DIR;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  // Check MIME type
  if (!UPLOAD_CONFIG.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error("Only image files are allowed (jpeg, png, gif, webp)"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
  },
  fileFilter,
});

module.exports = upload;