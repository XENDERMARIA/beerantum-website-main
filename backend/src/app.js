const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();






app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, 
  })
);


app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts. Please wait 15 minutes." },
});
app.use("/api/auth/login", authLimiter);




app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}


app.use("/uploads", express.static("uploads"));




app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/team", require("./routes/team.routes"));
app.use("/api/events", require("./routes/events.routes"));
app.use("/api/partners", require("./routes/partners.routes"));
app.use("/api/contact", require("./routes/contact.routes"));
app.use("/api/content", require("./routes/content.routes"));




app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Beerantum API is running",
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});




app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});




app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);

  
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ success: false, message: `${field} already exists` });
  }

  
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Token expired" });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
