import { Request, Response } from "express";
import Session from "../models/session.model.js";
import Player from "../models/player.model.js";
import { QuestionStatus, Topic } from "../utils/enum.js";
import { generateCode } from "../utils/helpers.js";

// Create a new session with an optional topic, generating a unique code for the session
export const createSession = async (req: Request, res: Response) => {
    try {
        const { topic } = req.body;

        if (topic && !Object.values(Topic).includes(topic)) {
            return res.status(400).json({
                success: false,
                message: "Invalid topic",
            });
        }

        const session = await Session.create({
            code: generateCode(),
            topic: topic || Topic.RANDOM,
        });

        return res.status(201).json({
            success: true,
            data: session,
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// Player joins a session by code, creating a new player and associating it with the session
export const joinSession = async (req: Request, res: Response) => {
    try {
        const { code } = req.params;
        const { name } = req.body;

        const session = await Session.findOne({ code });

        if (!session) {
            return res.status(404).json({
                message: "Session not found",
            });
        }

        const player = await Player.create({
            name,
            sessionId: session._id,
        });

        session.players.push(player._id);
        await session.save();

        return res.status(201).json({
            success: true,
            player,
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// Delete Player from session and remove from players list
export const deletePlayer = async (req: Request, res: Response) => {
    try {
        const { sessionId, playerId } = req.params;

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({
                message: "Session not found",
            });
        }
        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({
                message: "Player not found",
            });
        }
        await Player.findByIdAndDelete(playerId);
        session.players = session.players.filter(
            (id) => id.toString() !== playerId
        );
        await session.save();
        return res.json({
            success: true,
            message: "Player removed from session",
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// Get session details by code, including the list of players and current question
export const getSession = async (req: Request, res: Response) => {
    try {
        const { code } = req.params;

        const session = await Session.findOne({ code })
            .populate("players", "name")
            .populate("currentQuestion");

        if (!session) {
            return res.status(404).json({
                message: "Session not found",
            });
        }

        return res.json({
            success: true,
            data: session,
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// Host makes a decision on the current question (approve/reject), updating the session state accordingly
export const hostDecision = async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { decision } = req.body;

    const session = await Session.findById(sessionId);

    if (!session) {
        return res.status(404).json({
            message: "Session not found",
        });
    }

    if (!session.currentQuestion) {
        return res.status(400).json({ message: "No active question" });
    }

    if (!Object.values(QuestionStatus).includes(decision)) {
        return res.status(400).json({
            message: "Invalid decision",
        });
    }

    if (decision === QuestionStatus.APPROVED) {
        session.questionStatus = QuestionStatus.APPROVED;
        session.usedQuestions.push(session.currentQuestion);
        session.roundNumber += 1;
    }

    if (decision === QuestionStatus.REJECTED) {
        session.questionStatus = QuestionStatus.REJECTED;
        session.currentQuestion = null;
    }

    await session.save();

    return res.json({
        success: true,
        status: session.questionStatus,
    });
};