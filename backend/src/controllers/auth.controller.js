
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../config/jwt");
const { sendOTPEmail, sendWelcomeEmail } = require("../utils/email");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



function generateOTP() {
  return String(crypto.randomInt(100000, 999999));
}

function issueTokens(user) {
  const payload = { id: user._id, email: user.email, role: user.role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken({ id: user._id }),
  };
}



async function googleAuth(req, res, next) {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: "Google credential is required" });
    }

    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch {
      return res.status(401).json({ success: false, message: "Invalid Google token. Please try again." });
    }

    const { sub: googleId, email, name, picture } = ticket.getPayload();

    let user = await User.findOne({
      $or: [{ googleId }, { email: email.toLowerCase() }],
    }).select("+googleId +refreshToken");

    const isNewUser = !user;

    if (isNewUser) {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        googleId,
        googleAvatar: picture,
        authMethod: "google",
        isEmailVerified: true,
        role: "pending",
        isActive: true,
      });
    } else {
      user.googleId = googleId;
      user.googleAvatar = picture;
      if (!user.isEmailVerified) user.isEmailVerified = true;
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, code: "ACCOUNT_DISABLED", message: "Your account has been disabled. Contact the admin." });
    }

    if (user.role === "pending") {
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });
      return res.status(403).json({
        success: false,
        code: "PENDING_APPROVAL",
        message: isNewUser
          ? "Account created! The admin has been notified and will review your request. You will receive an email once approved."
          : "Your account is still pending approval. Please wait for the admin to grant you access.",
        user: { name: user.name, email: user.email, role: user.role },
      });
    }

    const { accessToken, refreshToken } = issueTokens(user);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: `Welcome, ${user.name}!`,
      data: { user: user.toSafeObject(), accessToken, refreshToken },
    });
  } catch (err) {
    next(err);
  }
}



async function sendOTP(req, res, next) {
  try {
    const { email, name, purpose = "login" } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    let user = await User.findOne({ email: email.toLowerCase() })
      .select("+otp +otpExpiry +otpAttempts");

    if (purpose === "signup") {
      if (user && user.isEmailVerified && user.authMethod === "local") {
        return res.status(409).json({ success: false, message: "Email already registered. Please log in instead." });
      }
      if (!user) {
        user = await User.create({
          name: name || email.split("@")[0],
          email: email.toLowerCase(),
          authMethod: "local",
          isEmailVerified: false,
          role: "pending",
        });
      }
    } else {
      if (!user) return res.status(404).json({ success: false, message: "No account found with this email." });
      if (!user.isEmailVerified) return res.status(403).json({ success: false, code: "EMAIL_NOT_VERIFIED", message: "Please verify your email first." });
    }

    const otp = generateOTP();
    user.otp = crypto.createHash("sha256").update(otp).digest("hex");
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otpAttempts = 0;
    await user.save({ validateBeforeSave: false });

    await sendOTPEmail({ to: email, name: user.name, otp });

    res.json({ success: true, message: `Verification code sent to ${email}. Check your inbox.` });
  } catch (err) {
    next(err);
  }
}



async function verifyOTP(req, res, next) {
  try {
    const { email, otp, purpose = "login" } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .select("+otp +otpExpiry +otpAttempts +refreshToken");

    if (!user) return res.status(404).json({ success: false, message: "Account not found." });

    
    if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, code: "OTP_EXPIRED", message: "Verification code has expired. Please request a new one." });
    }

    
    if (user.otpAttempts >= 3) {
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({ success: false, code: "OTP_LOCKED", message: "Too many wrong attempts. Please request a new code." });
    }

    
    const hash = crypto.createHash("sha256").update(otp).digest("hex");
    if (hash !== user.otp) {
      user.otpAttempts += 1;
      await user.save({ validateBeforeSave: false });
      const remaining = 3 - user.otpAttempts;
      return res.status(400).json({ success: false, message: `Incorrect code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` });
    }

    
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpAttempts = 0;

    if (purpose === "signup") {
      user.isEmailVerified = true;
      await user.save({ validateBeforeSave: false });
      return res.status(200).json({
        success: true,
        code: "PENDING_APPROVAL",
        message: "Email verified! Your account has been created and sent to the admin for approval. You will receive an email once approved.",
      });
    }

    
    if (user.role === "pending") {
      await user.save({ validateBeforeSave: false });
      return res.status(403).json({ success: false, code: "PENDING_APPROVAL", message: "Your account is pending admin approval." });
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account disabled. Contact the admin." });
    }

    const { accessToken, refreshToken } = issueTokens(user);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: "Login successful", data: { user: user.toSafeObject(), accessToken, refreshToken } });
  } catch (err) {
    next(err);
  }
}


async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase(), isActive: true })
      .select("+password +refreshToken");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    if (!user.isEmailVerified) {
      return res.status(403).json({ success: false, code: "EMAIL_NOT_VERIFIED", message: "Please verify your email before logging in." });
    }
    if (user.role === "pending") {
      return res.status(403).json({ success: false, code: "PENDING_APPROVAL", message: "Your account is pending admin approval." });
    }

    const { accessToken, refreshToken } = issueTokens(user);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: "Login successful", data: { user: user.toSafeObject(), accessToken, refreshToken } });
  } catch (err) {
    next(err);
  }
}



async function approveUser(req, res, next) {
  try {
    const { role } = req.body;
    if (!["editor", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Role must be 'editor' or 'admin'" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive: true },
      { new: true }
    );

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    
    try {
      await sendWelcomeEmail({ to: user.email, name: user.name, role });
    } catch {
      
      console.warn("Welcome email failed — check SMTP config");
    }

    res.json({ success: true, message: `${user.name} is now a ${role}`, data: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}


async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: "Refresh token required" });

    let decoded;
    try { decoded = verifyRefreshToken(refreshToken); }
    catch { return res.status(401).json({ success: false, message: "Invalid or expired refresh token" }); }

    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: "Refresh token is no longer valid" });
    }

    const tokens = issueTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, data: tokens });
  } catch (err) { next(err); }
}


async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    res.json({ success: true, message: "Logged out" });
  } catch (err) { next(err); }
}


async function getMe(req, res) {
  res.json({ success: true, data: req.user });
}


async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password changed" });
  } catch (err) { next(err); }
}


async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ success: false, message: "Email already registered" });
    const user = await User.create({ name, email, password, role: role || "editor", isEmailVerified: true, authMethod: "local" });
    res.status(201).json({ success: true, message: "User created", data: user.toSafeObject() });
  } catch (err) { next(err); }
}

module.exports = {
  googleAuth, sendOTP, verifyOTP, login, approveUser,
  refresh, logout, getMe, changePassword, register,
};