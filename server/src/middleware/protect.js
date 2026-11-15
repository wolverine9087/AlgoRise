import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ success: false, message: "Not authorized. Token missing." });

  const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("name email");
  if (!user) return res.status(401).json({ success: false, message: "User no longer exists" });
  req.user = { id: user.id, name: user.name, email: user.email };
  next();
});

export default protect;
