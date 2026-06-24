import { Request, Response } from "express";
import Stance from "../models/stance.model.js";
import { PlayerDecision } from "../utils/enum.js";

// Submit a stance for a question in a session
export const submitStance = async (
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
                message: "Invalid stance value",
            });
        }

        const existingStance = await Stance.findOne({
            sessionId,
            questionId,
            playerId,
        });

        if (existingStance) {
            return res.status(400).json({
                success: false,
                message: "Player already submitted a stance",
            });
        }

        const stance = await Stance.create({
            sessionId,
            questionId,
            playerId,
            value,
        });

        return res.status(201).json({
            success: true,
            data: stance,
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// Get stances for a question in a session
export const getStances = async (
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

        const stances = await Stance.find({
            sessionId,
            questionId,
        })
        .populate("playerId", "name")
        .lean();

        const formattedStances = stances.map((s: any) => ({
            playerId: s.playerId._id.toString(),
            playerName: s.playerId.name,
            value: s.value,
        }));

        return res.json({
            success: true,
            data: formattedStances,
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
