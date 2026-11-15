import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { schemaOptions } from "./schemaOptions.js";

const attemptSchema = new mongoose.Schema({
  _id: { type: String, default: () => randomUUID() },
  userId: { type: String, ref: "User", required: true },
  questionId: { type: String, ref: "Question", required: true },
  solved: { type: Boolean, default: false },
  viewedSolution: { type: Boolean, default: false },
  timeSpent: { type: Number, default: null, min: 0 },
  attemptedAt: { type: Date, default: Date.now },
}, { ...schemaOptions, collection: "Attempt" });

attemptSchema.index({ userId: 1, questionId: 1 });

export default mongoose.models.Attempt || mongoose.model("Attempt", attemptSchema);
