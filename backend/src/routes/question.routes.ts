import express from "express";
import {
  createQuestion,
  getQuestions,
} from "../controllers/question.controller.js";

const router = express.Router();

// POST /api/questions - Create a new question
router.post("/", createQuestion);

// GET /api/questions - Retrieve all questions
router.get("/", getQuestions);

export default router;