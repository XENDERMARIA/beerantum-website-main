const mongoose = require("mongoose");


const contentSchema = new mongoose.Schema(
  {
    
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    
    section: {
      type: String,
      required: true,
      trim: true,
    },
    
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

contentSchema.index({ key: 1 });

module.exports = mongoose.model("Content", contentSchema);
