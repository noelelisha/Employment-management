import express from "express";
import { getJournalEntries, createJournalEntry } from "../controllers/journalController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getJournalEntries);
router.post("/", createJournalEntry);

export default router;
