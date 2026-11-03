import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    learnedToday: { type: String, required: true },
    completedToday: { type: String, required: true },
    challengesFaced: { type: String, required: true },
    improveTomorrow: { type: String, required: true },
    mood: {
      type: String,
      enum: ["confident", "motivated", "neutral", "overwhelmed"],
      default: "confident"
    }
  },
  { timestamps: true }
);

export default mongoose.model("JournalEntry", journalEntrySchema);
