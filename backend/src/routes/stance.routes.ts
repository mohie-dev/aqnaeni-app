import express from "express";
import {
    submitStance,
    getStances
} from "../controllers/stance.controller.js";

const router = express.Router();

// POST /api/stances - Submit a stance
router.post("/", submitStance);

// GET /api/stances/:sessionId/:questionId - Get stances for a question in a session
router.get("/:sessionId/:questionId", getStances);

export default router;
