import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    department: { type: String, default: "Engineering" },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["planning", "in-progress", "completed", "on-hold"],
      default: "in-progress"
    },
    deadline: { type: Date, required: true },
    progress: { type: Number, min: 0, max: 100, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
