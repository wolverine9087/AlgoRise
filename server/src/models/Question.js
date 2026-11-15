import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { schemaOptions } from "./schemaOptions.js";

const questionSchema = new mongoose.Schema({
  _id: { type: String, default: () => randomUUID() },
  title: { type: String, required: true, trim: true },
  leetcodeUrl: { type: String, required: true, unique: true },
  topic: { type: String, required: true, trim: true },
  difficulty: { type: String, enum: ["EASY", "MEDIUM", "HARD"], required: true },
  description: { type: String, default: "" },
  examples: [{ input: String, output: String, explanation: String }],
  constraints: [String],
  platformLinks: [{ platform: String, url: String }],
  hint: { type: String, default: "" },
  solution: {
    approach: String,
    timeComplexity: String,
    spaceComplexity: String,
    javascript: String,
  },
  generatedByAI: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { ...schemaOptions, collection: "Question" });

export default mongoose.models.Question || mongoose.model("Question", questionSchema);
