const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title too long"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    endDate: {
      type: Date,
    },
    timeDisplay: {
      type: String, 
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [200, "Location too long"],
    },
    audience: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [500, "Short description too long"],
    },
    longDescription: {
      type: String,
      maxlength: [5000, "Long description too long"],
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "past"],
      default: "upcoming",
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    registrationUrl: {
      type: String,
      trim: true,
    },
    maxAttendees: {
      type: Number,
      min: [1, "Max attendees must be positive"],
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


eventSchema.index({ date: -1 });
eventSchema.index({ status: 1, date: 1 });

module.exports = mongoose.model("Event", eventSchema);
