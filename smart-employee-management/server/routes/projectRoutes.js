import express from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getMyProjectTasks,
  createProjectTask,
  submitProjectTask,
  reviewProjectTask
} from "../controllers/projectController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/tasks", getMyProjectTasks);
router.post("/tasks", authorize("admin", "manager"), createProjectTask);
router.patch("/tasks/:id/submit", submitProjectTask);
router.patch("/tasks/:id/review", authorize("admin", "manager"), reviewProjectTask);

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", authorize("admin", "manager"), createProject);
router.put("/:id", authorize("admin", "manager"), updateProject);
router.delete("/:id", authorize("admin", "manager"), deleteProject);

export default router;
