import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    badgeCode: {
      type: String,
      enum: [
        "team-player",
        "good-communicator",
        "goal-achiever",
        "confident-presenter",
        "quick-learner",
        "problem-solver"
      ],
      required: true,
      unique: true
    },
    description: { type: String, required: true },
    icon: { type: String, default: "Award" },
    color: { type: String, default: "#3b82f6" },
    recipients: [
      {
        employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        awardedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        awardedAt: { type: Date, default: Date.now },
        note: { type: String, default: "" }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Achievement", achievementSchema);
