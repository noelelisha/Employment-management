import mongoose from "mongoose";

const trainingProgressSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    completedLessons: [{ type: Number }], // indices of completed lessons
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

trainingProgressSchema.index({ employee: 1, course: 1 }, { unique: true });

export default mongoose.model("TrainingProgress", trainingProgressSchema);
