import express from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  completeLesson
} from "../controllers/courseController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", authorize("admin"), createCourse);
router.post("/:courseId/complete-lesson", completeLesson);

export default router;
