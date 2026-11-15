import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { schemaOptions } from "./schemaOptions.js";

const userSchema = new mongoose.Schema({
  _id: { type: String, default: () => randomUUID() },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  createdAt: { type: Date, default: Date.now },
}, { ...schemaOptions, collection: "User" });

export default mongoose.models.User || mongoose.model("User", userSchema);
