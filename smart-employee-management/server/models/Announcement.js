import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    department: { type: String, default: "All" },
    priority: {
      type: String,
      enum: ["general", "important", "urgent"],
      default: "general"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
