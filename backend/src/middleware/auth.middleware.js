
const { verifyAccessToken } = require("../config/jwt");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Token expired. Please login again." });
      }
      return res.status(401).json({ success: false, message: "Invalid token." });
    }

    const user = await User.findById(decoded.id).select("+passwordChangedAt");
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "User no longer exists or is inactive." });
    }
    if (user.passwordChangedAfter(decoded.iat)) {
      return res.status(401).json({ success: false, message: "Password recently changed. Please login again." });
    }
    
    if (user.role === "pending") {
      return res.status(403).json({ success: false, code: "PENDING_APPROVAL", message: "Your account is awaiting admin approval." });
    }

    req.user = user.toSafeObject();
    next();
  } catch (err) {
    next(err);
  }
}

function restrictTo(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated." });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `Access denied. Required role: ${roles.join(" or ")}` });
    }
    next();
  };
}

async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return next();
    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);
    if (user && user.isActive && user.role !== "pending") req.user = user.toSafeObject();
    next();
  } catch { next(); }
}

module.exports = { protect, restrictTo, optionalAuth };