import express from "express";
import { generateDailyQuestionSet } from "../controllers/question.controller.js";

const router = express.Router();
router.post("/daily-generate", generateDailyQuestionSet);

export default router;
