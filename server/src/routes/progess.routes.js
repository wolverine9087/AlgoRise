import express from "express";
import {
  getMyProgress,
  updateProgress
} from "../controllers/progress.controller.js";
import protect from "../middleware/protect.js";

const router = express.Router();

router.get("/", protect, getMyProgress);
router.patch("/", protect, updateProgress);

export default router;