import express from "express";
import {
  getMessagesWithUser,
  sendMessage,
  getAnnouncements,
  createAnnouncement
} from "../controllers/communicationController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/messages/:otherUserId", getMessagesWithUser);
router.post("/messages", sendMessage);

router.get("/announcements", getAnnouncements);
router.post("/announcements", authorize("admin", "hr", "manager"), createAnnouncement);

export default router;
