import express from "express";
import { register, login, logout, getMe } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);

// Admin and HR can register employees directly
router.post("/register", protect, authorize("admin", "hr"), register);

export default router;
