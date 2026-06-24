import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },

    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

playerSchema.index({ sessionId: 1 });

export default mongoose.model("Player", playerSchema);