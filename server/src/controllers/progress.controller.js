
import Question from "../models/Question.js";
import UserProgress from "../models/UserProgress.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getMyProgress = asyncHandler(async (req, res) => {
  // Fetch logged-in user's progress
  const progress = await UserProgress.find({
    userId: req.user.id,
  })
    .sort({ updatedAt: -1 })
    .populate("questionId");

  // Transform progress records
  const items = progress.map((entry) => {
    const value = entry.toJSON();

    value.question = entry.questionId;

    value.questionId = String(
      entry.questionId?._id || entry.questionId
    );

    return value;
  });

  // Send progress summary and records
  res.status(200).json({
    success: true,

    summary: {
      totalAttempted: items.length,

      solved: items.filter(
        (item) => item.status === "SOLVED"
      ).length,

      skipped: items.filter(
        (item) => item.status === "SKIPPED"
      ).length,

      solutionViewed: items.filter(
        (item) => item.status === "SOLUTION_VIEWED"
      ).length,
    },

    progress: items,
  });
});

export const updateProgress = asyncHandler(async (req, res) => {
  // Get data from request body
  const { questionId, status } = req.body;

  // Allowed progress statuses
  const allowedStatuses = [
    "NOT_STARTED",
    "SOLVED",
    "SKIPPED",
    "SOLUTION_VIEWED",
  ];

  // Validate request data
  if (!questionId || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Valid questionId and status are required",
    });
  }

  // Check whether the question exists
  if (!(await Question.exists({ _id: questionId }))) {
    return res.status(404).json({
      success: false,
      message: "Question not found",
    });
  }

  const now = new Date();

  // Find existing progress or create a new record
  const progress = await UserProgress.findOneAndUpdate(
    {
      userId: req.user.id,
      questionId,
    },
    {
      $set: {
        status,
        updatedAt: now,

        ...(status === "SOLVED"
          ? { solvedAt: now }
          : {}),
      },

      $setOnInsert: {
        attempts: 0,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  // Send updated progress
  res.status(200).json({
    success: true,
    message: "Progress updated",
    progress,
  });
});
