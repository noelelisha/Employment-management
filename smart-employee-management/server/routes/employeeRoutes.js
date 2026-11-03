import express from "express";
import {
  getEmployees,
  getEmployeeById,
  updateEmployee,
  toggleEmployeeStatus,
  getTeamMembers
} from "../controllers/employeeController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/team", getTeamMembers);
router.get("/", authorize("admin", "hr", "manager"), getEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", authorize("admin", "hr", "manager"), updateEmployee);
router.patch("/:id/toggle-status", authorize("admin", "hr"), toggleEmployeeStatus);

export default router;
