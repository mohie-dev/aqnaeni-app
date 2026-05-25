import mongoose from "mongoose";
import { PlayerDecision } from "../utils/enum.js";

const voteSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },

    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },

    value: {
      type: String,
      enum: Object.values(PlayerDecision),
      required: true,
    },
  },
  { timestamps: true }
);

voteSchema.index(
  { sessionId: 1, questionId: 1, playerId: 1 },
  { unique: true }
);

export default mongoose.model("Vote", voteSchema);