import mongoose from "mongoose";

const questionHistorySchema = new mongoose.Schema(
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
    },

    accepted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

questionHistorySchema.index({ sessionId: 1, questionId: 1 });

export default mongoose.model("QuestionHistory", questionHistorySchema);