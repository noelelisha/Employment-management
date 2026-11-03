import JournalEntry from "../models/JournalEntry.js";

export const getJournalEntries = async (req, res) => {
  try {
    const targetUserId = req.query.employeeId || req.user._id;

    // Non-admins/managers can only view their own journal
    if (
      targetUserId.toString() !== req.user._id.toString() &&
      !["admin", "hr", "manager"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Not authorized to view another employee's journal" });
    }

    const entries = await JournalEntry.find({ employee: targetUserId }).sort({ date: -1 });
    res.status(200).json({ success: true, count: entries.length, entries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createJournalEntry = async (req, res) => {
  try {
    const { learnedToday, completedToday, challengesFaced, improveTomorrow, mood } = req.body;

    if (!learnedToday || !completedToday || !challengesFaced || !improveTomorrow) {
      return res.status(400).json({ message: "Please fill all four daily reflection questions" });
    }

    const entry = await JournalEntry.create({
      employee: req.user._id,
      learnedToday,
      completedToday,
      challengesFaced,
      improveTomorrow,
      mood: mood || "confident",
      date: new Date()
    });

    res.status(201).json({ success: true, entry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
