import { generateDailyQuestions } from "../services/dailyQuestion.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const generateDailyQuestionSet = asyncHandler(async (req, res) => {
    // Get and validate the requested question count
    const count = Number(req.body?.count);

    if (!Number.isInteger(count) || count < 1 || count > 10) {
      return res.status(400).json({
        success: false,
        message: "Daily question count must be between 1 and 10.",
      });
    }

    // Get topic performance data
    const topicPerformance =
      req.body?.topicPerformance &&
      typeof req.body.topicPerformance === "object"
        ? req.body.topicPerformance
        : {};

    // Get and filter question slugs to avoid
    const avoidSlugs = Array.isArray(req.body?.avoidSlugs)
      ? req.body.avoidSlugs
          .filter((slug) => typeof slug === "string")
          .slice(0, 500)
      : [];

    // Generate daily questions
    const questions = await generateDailyQuestions({
      count,
      topicPerformance,
      avoidSlugs,
    });

    // Send response
    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
      source: "groq",
    });
  }
);
