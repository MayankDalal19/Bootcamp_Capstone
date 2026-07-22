const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protects routes by verifying the JWT sent in the Authorization header
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      token = authHeader.split(" ")[1];

      // Verify token signature & expiry
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user (without password) to request object
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Token expired, please log in again" });
      }
      return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
