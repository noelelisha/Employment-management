import Message from "../models/Message.js";
import Announcement from "../models/Announcement.js";
import User from "../models/User.js";

// Internal Messaging
export const getMessagesWithUser = async (req, res) => {
  try {
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: otherUserId },
        { sender: otherUserId, recipient: req.user._id }
      ]
    })
      .populate("sender", "name email designation")
      .populate("recipient", "name email designation")
      .sort({ createdAt: 1 });

    // Mark unread messages as read
    await Message.updateMany(
      { sender: otherUserId, recipient: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ success: true, count: messages.length, messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;

    if (!recipientId || !content) {
      return res.status(400).json({ message: "Recipient and content are required" });
    }

    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      content
    });

    const populated = await Message.findById(message._id)
      .populate("sender", "name email")
      .populate("recipient", "name email");

    res.status(201).json({ success: true, message: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Announcements
export const getAnnouncements = async (req, res) => {
  try {
    const query = {
      $or: [{ department: "All" }, { department: req.user.department }]
    };

    const announcements = await Announcement.find(query)
      .populate("author", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: announcements.length, announcements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, department, priority } = req.body;

    const announcement = await Announcement.create({
      title,
      content,
      department: department || "All",
      priority: priority || "general",
      author: req.user._id
    });

    res.status(201).json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
