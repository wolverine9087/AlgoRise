import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { schemaOptions } from "./schemaOptions.js";

const userProgressSchema = new mongoose.Schema({
  _id: { type: String, default: () => randomUUID() },
  userId: { type: String, ref: "User", required: true },
  questionId: { type: String, ref: "Question", required: true },
  status: { type: String, enum: ["NOT_STARTED", "SOLVED", "SKIPPED", "SOLUTION_VIEWED"], default: "NOT_STARTED" },
  attempts: { type: Number, default: 0, min: 0 },
  solvedAt: { type: Date, default: null },
  updatedAt: { type: Date, default: Date.now },
}, { ...schemaOptions, collection: "UserProgress" });

userProgressSchema.index({ userId: 1, questionId: 1 }, { unique: true });

export default mongoose.models.UserProgress || mongoose.model("UserProgress", userProgressSchema);
