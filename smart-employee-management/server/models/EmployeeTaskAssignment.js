import mongoose from "mongoose";

const employeeTaskAssignmentSchema = new mongoose.Schema(
  {
    template: { type: mongoose.Schema.Types.ObjectId, ref: "ConfidenceTaskTemplate", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["pending", "in-progress", "submitted", "completed"],
      default: "pending"
    },
    completionPercentage: { type: Number, min: 0, max: 100, default: 0 },
    submissionText: { type: String, default: "" },
    attachmentUrl: { type: String, default: "" },
    feedback: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5, default: null },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("EmployeeTaskAssignment", employeeTaskAssignmentSchema);
