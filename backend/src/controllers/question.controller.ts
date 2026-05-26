import Question from "../models/question.model.js";
import Session from "../models/session.model.js";
import { Request, Response } from "express";
import { Mood, Topic, QuestionStatus } from "../utils/enum.js";

// Create a new question with content, topic, and optional mood
export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { content, topic, mood } = req.body;

    if (!content || !topic) {
      return res.status(400).json({
        success: false,
        message: "Content and topic are required",
      });
    }

    if (!Object.values(Topic).includes(topic)) {
      return res.status(400).json({
        success: false,
        message: "Invalid topic",
      });
    }

    if (mood && !Object.values(Mood).includes(mood)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mood",
      });
    }

    const question = await Question.create({
      content,
      topic,
      mood,
    });

    return res.status(201).json({
      success: true,
      data: question,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get questions with optional filtering by topic
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { topic } = req.query;


    const filter: any = {  };

    if (topic) {
      filter.topic = topic;
    }

    const questions = await Question.find(filter);

    return res.json({
      success: true,
      data: questions,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get a random question preview for a session based on the session's topic and used questions
export const getNextQuestion = async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const session = await Session.findById({ _id: sessionId });

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  // Fetch a random question that matches the session's topic and hasn't been used in the session
  // Questions Should Be In The Same Topic As The Session, Active, And Not In The Used Questions List For The Session
  const question = await Question.aggregate([
    {
      $match: {
        _id: { $nin: session.usedQuestions },
        isActive: true,
        topic: session.topic,
      },
    },
    { $sample: { size: 1 } },
  ]);

  // If no questions are available, return a 404 response
  if (!question.length) {
    return res.status(404).json({ message: "No questions left" });
  }

  // Set the session's current question to the selected question and update the question status to pending
  session.currentQuestion = question[0]._id;
  session.questionStatus = QuestionStatus.PENDING;

  await session.save();

  return res.json({
    success: true,
    data: question[0],
  });
};

