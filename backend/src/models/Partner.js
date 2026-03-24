const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Partner name is required"],
      trim: true,
      maxlength: [100, "Name too long"],
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    logoText: {
      type: String, 
      trim: true,
      maxlength: [50, "Logo text too long"],
    },
    website: {
      type: String,
      trim: true,
    },
    tier: {
      type: String,
      enum: ["platinum", "gold", "silver", "partner"],
      default: "partner",
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
  {
    timestamps: true,
  }
);

partnerSchema.index({ order: 1 });

module.exports = mongoose.model("Partner", partnerSchema);
