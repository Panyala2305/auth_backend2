import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  // Create JWT
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  // Send JWT in HttpOnly Cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;