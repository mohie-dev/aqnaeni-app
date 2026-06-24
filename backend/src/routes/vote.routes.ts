import express from "express";
import {
    submitVote,
    getResults
} from "../controllers/vote.controller.js";

const router = express.Router();

// POST /api/votes - Submit a vote for a question in a session
router.post("/", submitVote);

// GET /api/votes/results - Get results for a question in a session
router.get("/results/:sessionId/:questionId", getResults);

export default router;