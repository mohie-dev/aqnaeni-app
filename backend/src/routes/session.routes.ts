import express from "express";
import {
    createSession,
    joinSession,
    getSession,
    hostDecision,
    deletePlayer,
} from "../controllers/session.controller.js";
import { getNextQuestion } from "../controllers/question.controller.js";

const router = express.Router();

// POST /api/sessions - Create a new session with an optional topic
router.post("/", createSession);

// POST /api/sessions/:code/join - Join a session by code, creating a new player
router.post("/:code/join", joinSession);

// DELETE /api/sessions/:sessionId/:playerId - Remove a player from a session
router.delete("/:sessionId/:playerId", deletePlayer);

// GET /api/sessions/:code - Retrieve session details by code
router.get("/:code", getSession);

// GET /api/sessions/:sessionId/question - Get the current question for a session
router.get("/:sessionId/question", getNextQuestion);

// POST /api/sessions/:sessionId/question/decision - Get a random question preview for a session
router.post("/:sessionId/question/decision", hostDecision);

export default router;