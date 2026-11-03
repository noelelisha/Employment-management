import Achievement from "../models/Achievement.js";

export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().populate("recipients.employee", "name email department designation");

    // Format achievements with indicator if current user earned it
    const list = achievements.map((ach) => {
      const recipientRecord = ach.recipients.find(
        (r) => r.employee && r.employee._id && r.employee._id.toString() === req.user._id.toString()
      );
      return {
        ...ach.toObject(),
        earnedByMe: !!recipientRecord,
        myAwardDate: recipientRecord ? recipientRecord.awardedAt : null,
        myAwardNote: recipientRecord ? recipientRecord.note : ""
      };
    });

    res.status(200).json({ success: true, achievements: list });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const awardAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId, note } = req.body;

    const achievement = await Achievement.findById(id);
    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    // Check if already awarded
    const alreadyAwarded = achievement.recipients.some(
      (r) => r.employee.toString() === employeeId.toString()
    );

    if (alreadyAwarded) {
      return res.status(400).json({ message: "Employee already has this achievement badge" });
    }

    achievement.recipients.push({
      employee: employeeId,
      awardedBy: req.user._id,
      awardedAt: new Date(),
      note: note || ""
    });

    await achievement.save();

    res.status(200).json({ success: true, message: "Badge awarded successfully", achievement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
