const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Achievement title is required"],
      trim: true,
      maxlength: [200, "Title too long"],
    },
    placement: {
      type: String,
      required: [true, "Placement is required"],
      trim: true,
      maxlength: [50, "Placement too long"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    description: {
      type: String,
      maxlength: [2000, "Description too long"],
    },
    competitionUrl: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
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

achievementSchema.index({ order: 1 });
achievementSchema.index({ year: -1 });

module.exports = mongoose.model("Achievement", achievementSchema);
