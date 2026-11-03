import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "hr", "manager", "employee"],
      default: "employee"
    },
    department: { type: String, default: "Engineering" },
    designation: { type: String, default: "New Recruit" },
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },
    joinDate: { type: Date, default: Date.now },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    isActive: { type: Boolean, default: true },
    onboardingStatus: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
      default: "in-progress"
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
