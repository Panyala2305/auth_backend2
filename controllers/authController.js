import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// ==========================
// Signup
// ==========================
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check empty fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Signup Successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================
// Login
// ==========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check empty fields
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Find User
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

    // Generate JWT Cookie
    generateToken(res, user._id);

    res.status(200).json({
      message: "Login Successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================
// Profile
// ==========================
export const getProfile = async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

// ==========================
// Logout
// ==========================
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({
    message: "Logout Successful",
  });
};