const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name too long"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
      maxlength: [100, "Role too long"],
    },
    education: {
      type: String,
      required: [true, "Education is required"],
      trim: true,
      maxlength: [200, "Education text too long"],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio too long"],
    },
    
    photoUrl: {
      type: String,
      trim: true,
    },
    isLeadership: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 99,
    },
    socialLinks: {
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      twitter: { type: String, trim: true },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


teamMemberSchema.index({ order: 1, createdAt: 1 });

module.exports = mongoose.model("TeamMember", teamMemberSchema);
