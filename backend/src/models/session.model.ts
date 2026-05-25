import mongoose from "mongoose";
import { QuestionStatus, SessionStatus, Topic } from "../utils/enum.js";

const sessionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(SessionStatus),
      default: SessionStatus.ACTIVE,
    },

    topic: {
      type: String,
      enum: Object.values(Topic),
      default: Topic.RANDOM,
      index: true,
    },

    currentQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      default: null,
    },

    questionStatus: {
      type: String,
      enum: Object.values(QuestionStatus),
      default: QuestionStatus.IDLE,
    },

    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],

    usedQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    roundNumber: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);