
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    
    authMethod: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      sparse: true, 
      select: false,
    },
    googleAvatar: { type: String },

    
    isEmailVerified: { type: Boolean, default: false },
    otp:             { type: String,  select: false },
    otpExpiry:       { type: Date,    select: false },
    otpAttempts:     { type: Number,  default: 0, select: false },

    
    
    
    
    role: {
      type: String,
      enum: ["pending", "editor", "admin"],
      default: "pending",
    },

    isActive:           { type: Boolean, default: true },
    refreshToken:       { type: String,  select: false },
    lastLogin:          { type: Date },
    passwordChangedAt:  { type: Date },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  if (!this.isNew) this.passwordChangedAt = new Date();
  next();
});

userSchema.methods.comparePassword = async function (plain) {
  if (!this.password) return false;
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.passwordChangedAfter = function (iat) {
  if (this.passwordChangedAt) {
    return Math.floor(this.passwordChangedAt.getTime() / 1000) > iat;
  }
  return false;
};

userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    authMethod: this.authMethod,
    googleAvatar: this.googleAvatar,
    isEmailVerified: this.isEmailVerified,
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);