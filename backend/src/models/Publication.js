const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Publication title is required"],
      trim: true,
      maxlength: [300, "Title too long"],
    },
    authors: {
      type: [String],
      default: [],
    },
    publishedIn: {
      type: String,
      trim: true,
      maxlength: [200, "Published-in field too long"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    abstract: {
      type: String,
      maxlength: [3000, "Abstract too long"],
    },
    url: {
      type: String,
      trim: true,
    },
    doi: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
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

publicationSchema.index({ year: -1 });
publicationSchema.index({ order: 1 });

module.exports = mongoose.model("Publication", publicationSchema);
