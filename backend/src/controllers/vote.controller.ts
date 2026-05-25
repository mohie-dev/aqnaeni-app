import { Request, Response } from "express";
import Vote from "../models/vote.model.js";
import { PlayerDecision } from "../utils/enum.js";
import { calculateResults, pickOppositeDefender } from "../services/game.service.js";

// Submit a vote for a question in a session
export const submitVote = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            sessionId,
            questionId,
            playerId,
            value,
        } = req.body;

        if (!sessionId || !questionId || !playerId || !value) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        if (!Object.values(PlayerDecision).includes(value)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vote value",
            });
        }

        const existingVote = await Vote.findOne({
            sessionId,
            questionId,
            playerId,
        });

        if (existingVote) {
            return res.status(400).json({
                success: false,
                message: "Player already voted",
            });
        }

        const vote = await Vote.create({
            sessionId,
            questionId,
            playerId,
            value,
        });

        return res.status(201).json({
            success: true,
            data: vote,
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// Get results for a question in a session, returning counts of agree/disagree and individual votes
export const getResults = async (
    req: Request,
    res: Response
) => {
    try {

        const { sessionId, questionId } = req.params;

        // Validation to ensure sessionId and questionId are valid strings
        if (!sessionId || !questionId || typeof sessionId !== 'string' || typeof questionId !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Missing or invalid required parameters",
            });
        }

        const results = await calculateResults(
            sessionId,
            questionId
        );

        return res.json({
            success: true,
            data: results,
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// Get a random player from the votes who voted opposite to the majority 
// and assign them as the defender for the next round
export const getDefender = async (
    req: Request,
    res: Response
) => {

    try {

        const { sessionId, questionId } = req.params;

        if (!sessionId || !questionId || typeof sessionId !== 'string' || typeof questionId !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Missing or invalid required parameters",
            });
        }

        const votes = await Vote.find({
            sessionId,
            questionId,
        })
            .populate("playerId", "name")
            .lean();

        const defender =
            pickOppositeDefender(votes);

        return res.json({
            success: true,
            data: defender,
        });

    } catch (err: any) {

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};