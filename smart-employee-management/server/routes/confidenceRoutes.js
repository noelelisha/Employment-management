import express from "express";
import {
  getTemplates,
  createTemplate,
  assignJourneyToEmployee,
  getEmployeeAssignments,
  submitAssignment,
  reviewAssignment,
  getPendingReviews
} from "../controllers/confidenceController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/templates", getTemplates);
router.post("/templates", authorize("admin", "hr"), createTemplate);

router.get("/assignments", getEmployeeAssignments);
router.post("/assign/:employeeId", authorize("admin", "hr", "manager"), assignJourneyToEmployee);

router.patch("/assignments/:id/submit", submitAssignment);
router.patch("/assignments/:id/review", authorize("admin", "hr", "manager"), reviewAssignment);
router.get("/reviews/pending", authorize("admin", "hr", "manager"), getPendingReviews);

export default router;
