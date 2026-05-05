const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const { findById } = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  if (!process.env.JWT_SECRET) {
    res.status(500);
    throw new Error("JWT_SECRET is not set");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await findById(decoded.id);

  if (!user) {
    res.status(401);
    throw new Error("Not authorized, user not found");
  }

  req.user = user;
  next();
});

module.exports = { protect };
