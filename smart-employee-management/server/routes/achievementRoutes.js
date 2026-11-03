import express from "express";
import { getAchievements, awardAchievement } from "../controllers/achievementController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getAchievements);
router.post("/:id/award", authorize("admin", "hr", "manager"), awardAchievement);

export default router;
