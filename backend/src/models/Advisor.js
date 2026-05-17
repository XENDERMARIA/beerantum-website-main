const mongoose = require("mongoose");

const advisorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Advisor name is required"],
      trim: true,
      maxlength: [100, "Name too long"],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, "Title too long"],
    },
    affiliation: {
      type: String,
      trim: true,
      maxlength: [200, "Affiliation too long"],
    },
    bio: {
      type: String,
      maxlength: [2000, "Bio too long"],
    },
    photoUrl: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    socialLinks: {
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      twitter: { type: String, trim: true },
    },
    order: {
      type: Number,
      default: 99,
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
  { timestamps: true }
);

advisorSchema.index({ order: 1 });

module.exports = mongoose.model("Advisor", advisorSchema);
