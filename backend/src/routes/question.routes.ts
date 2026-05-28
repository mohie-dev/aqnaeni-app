import express from "express";
import {
  createQuestion,
  deleteQuestion,
  getQuestions,
  updateQuestion,
} from "../controllers/question.controller.js";

const router = express.Router();

// POST /api/questions - Create a new question
router.post("/", createQuestion);

// GET /api/questions - Retrieve all questions
router.get("/", getQuestions);

// PUT /api/questions/:id - Update a question
router.put("/:id", updateQuestion);

// DELETE /api/questions/:id - Delete a question
router.delete("/:id", deleteQuestion);

export default router;