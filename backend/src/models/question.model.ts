import mongoose from "mongoose";
import { Mood, Topic } from "../utils/enum.js";

const questionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      enum: Object.values(Topic),
      index: true,
    },

    mood: {
      type: String,
      enum: Object.values(Mood),
      default: Mood.MEDIUM,
    },

    stats: {
      skipCount: { type: Number, default: 0 },
      acceptCount: { type: Number, default: 0 },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

questionSchema.index({ topic: 1, mood: 1 });

export default mongoose.model("Question", questionSchema);