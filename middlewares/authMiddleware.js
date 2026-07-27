import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    // Read token from HttpOnly Cookie
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized. Please login.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user using ID stored in JWT
    const user = await User.findById(decoded.userId).select("-password");

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    // Attach user to request
    req.user = user;

    // Continue to next middleware/controller
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or Expired Token",
    });
  }
};

export default protect;