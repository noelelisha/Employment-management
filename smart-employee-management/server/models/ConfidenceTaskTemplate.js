import mongoose from "mongoose";

const confidenceTaskTemplateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    instructions: { type: String, default: "" },
    category: {
      type: String,
      enum: ["general-journey", "department-specific"],
      default: "general-journey"
    },
    weekNumber: { type: Number, min: 1, max: 4, default: 1 },
    dayNumber: { type: Number, min: 1, max: 30, default: 1 },
    department: { type: String, default: "All" },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    }
  },
  { timestamps: true }
);

export default mongoose.model("ConfidenceTaskTemplate", confidenceTaskTemplateSchema);
