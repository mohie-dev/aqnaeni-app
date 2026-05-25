import Session from "../models/session.model.js";
import Question from "../models/question.model.js";
import Vote from "../models/vote.model.js";
import mongoose from "mongoose";
import { PlayerDecision } from "../utils/enum.js";
import { PopulatedVote } from "../utils/types.js";

// Fetch a random question for the session's topic, excluding already used questions
export const getPreviewQuestion = async (
    sessionId: string,
    topic: string
) => {
    const session = await Session.findById(sessionId);

    if (!session) {
        throw new Error("Session not found");
    }

    // Use aggregation to fetch a random question that matches the topic and hasn't been used in the session
    const question = await Question.aggregate([
        {
            $match: {
                topic,
                isActive: true,
                _id: {
                    $nin: session.usedQuestions,
                },
            },
        },
        {
            $sample: { size: 1 },
        },
    ]);

    if (!question.length) {
        throw new Error("No available questions");
    }

    return question[0];
};


// Accept a question for the session, updating the session's current question and used questions list
export const acceptQuestion = async (
    sessionId: string,
    questionId: string
) => {
    const session = await Session.findById(sessionId);

    if (!session) {
        throw new Error("Session not found");
    }

    const questionHistory = session.usedQuestions.some((qId) => qId.toString() === questionId)

    if (questionHistory) {
        throw new Error("Question already used");
    }

    const objectQuestionId = toObjectId(questionId);

    session.currentQuestion = objectQuestionId;

    session.usedQuestions.push(objectQuestionId);

    session.roundNumber += 1;

    await session.save();

    await Question.findByIdAndUpdate(questionId, {
        $inc: {
            "stats.acceptCount": 1,
        },
    });

    return session;
};

// Skip a question, incrementing the skip count for the question
export const skipQuestion = async (questionId: string) => {
    await Question.findByIdAndUpdate(questionId, {
        $inc: {
            "stats.skipCount": 1,
        },
    });

    return {
        message: "Question skipped",
    };
};

// Calculate the results for a specific question in a session
export const calculateResults = async (
    sessionId: string,
    questionId: string
) => {
    const votes = await Vote.find({
        sessionId,
        questionId,
    })
        .populate("playerId", "name")
        .lean<PopulatedVote[]>();

    let agree = 0;
    let disagree = 0;

    for (const vote of votes) {
        if (vote.value === PlayerDecision.AGREE) agree++;
        else if (vote.value === PlayerDecision.DISAGREE) disagree++;
    }

    const detailedVotes = votes.map((vote) => ({
        playerName: vote.playerId.name,
        vote: vote.value,
    }));

    return {
        agree,
        disagree,
        votes: detailedVotes,
    };
};

// Pick the opposite defender based on the votes for a question in a session
export const pickOppositeDefender = (votes: any[]) => {
    if (!votes.length) {
        return null;
    }

    // Randomly select a vote from the votes array
    const randomIndex = Math.floor(
        Math.random() * votes.length
    );

    const selectedVote = votes[randomIndex];

    // Determine the opposite side for the selected vote
    let defendSide = "";

    if (selectedVote.value === PlayerDecision.AGREE) {
        defendSide = PlayerDecision.DISAGREE;
    } else if (selectedVote.value === PlayerDecision.DISAGREE) {
        defendSide = PlayerDecision.AGREE;
    } else {
        defendSide = PlayerDecision.AGREE; // أو random later
    }

    return {
        player: selectedVote.playerId,
        originalVote: selectedVote.value,
        mustDefend: defendSide,
    };
};

// Helper function to convert string ID to ObjectId
const toObjectId = (id: string) => new mongoose.Types.ObjectId(id);