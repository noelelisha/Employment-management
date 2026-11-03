import mongoose from "mongoose";

const projectTaskSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: { type: Date, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "submitted", "completed"],
      default: "pending"
    },
    submissionText: { type: String, default: "" },
    attachmentUrl: { type: String, default: "" },
    feedback: { type: String, default: "" },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("ProjectTask", projectTaskSchema);
