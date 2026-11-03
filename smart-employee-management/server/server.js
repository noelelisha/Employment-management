import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import confidenceRoutes from "./routes/confidenceRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import communicationRoutes from "./routes/communicationRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for local development & playwright testing
      }
    },
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

// Mount API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Smart Employee Management API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/confidence", confidenceRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/communication", communicationRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/analytics", analyticsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("API error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });
});

const PORT = process.env.PORT || 5000;

// Connect to DB and listen
if (process.env.NODE_ENV !== "test") {
  connectDB()
    .then(() => {
      app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
    })
    .catch((error) => {
      console.error("Unable to start server:", error.message);
      process.exit(1);
    });
}

export default app;
