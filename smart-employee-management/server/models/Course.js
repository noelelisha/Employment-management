import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  keyTakeaway: { type: String, default: "" },
  durationMinutes: { type: Number, default: 10 }
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        "Communication",
        "Teamwork",
        "Time Management",
        "Problem-Solving",
        "Professional Behavior",
        "Project Management",
        "Presentation Skills",
        "Workplace Confidence"
      ],
      required: true
    },
    description: { type: String, required: true },
    duration: { type: String, default: "45 mins" },
    icon: { type: String, default: "BookOpen" },
    lessons: [lessonSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
