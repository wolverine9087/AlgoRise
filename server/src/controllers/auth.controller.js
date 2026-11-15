import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// Generate JWT Token
const generateToken = (userId) =>
  jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// Register User
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least 6 characters",
    });
  }

  // Normalize email
  const normalizedEmail = email.trim().toLowerCase();

  // Check if email already exists
  if (await User.exists({ email: normalizedEmail })) {
    return res.status(409).json({
      success: false,
      message: "Email already registered",
    });
  }

  // Create new user
  const user = await User.create({
    name,
    email: normalizedEmail,
    password: await bcrypt.hash(password, 12),
  });

  // Send registration response
  res.status(201).json({
    success: true,
    message: "Account created successfully",
    token: generateToken(user.id),

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

// Login User
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  // Find user by email
  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+password");

  // Verify user credentials
  if (
    !user ||
    !(await bcrypt.compare(password, user.password))
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Send login response
  res.status(200).json({
    success: true,
    message: "Login successful",
    token: generateToken(user.id),

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

// Get Logged-in User
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "name email createdAt"
  );

  res.status(200).json({
    success: true,
    user,
  });
});
