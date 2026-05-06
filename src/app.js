const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");

// Import Routes
const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const tutorialRoutes = require("./routes/tutorial.routes");
const userRoutes = require("./routes/user.routes");
const aiRoutes = require("./routes/ai.routes");
const chatbotRoutes = require("./routes/chatbot.routes");
const feedbackRoutes = require("./routes/feedback.routes");

// Import Middleware
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// ========== Middleware Setup ==========
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use("/uploads", express.static("uploads"));

// ========== API Routes (v1) ==========
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/tutorials", tutorialRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/chatbot", chatbotRoutes);
app.use("/api/v1/feedback", feedbackRoutes);

// ========== Health Check Route ==========
app.get("/api/v1/health", (req, res) => {
  res.json({ status: "OK", message: "UltraTech Connect API is running" });
});

// ========== 404 Handler ==========
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
  });
});

// ========== Error Handler Middleware ==========
app.use(errorHandler);

// ========== Database Connection & Server Start ==========
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║           🚀 UltraTech Connect Backend Started!          ║
║                                                           ║
║  Server running on http://localhost:${PORT}                     ║
║  Environment: ${process.env.NODE_ENV || "development"}                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;