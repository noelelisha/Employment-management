import express from "express";
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from "../controllers/departmentController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getDepartments);
router.get("/:id", getDepartmentById);
router.post("/", authorize("admin"), createDepartment);
router.put("/:id", authorize("admin"), updateDepartment);
router.delete("/:id", authorize("admin"), deleteDepartment);

export default router;
