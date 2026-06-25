import Session from "../models/session.model.js";
import Question from "../models/question.model.js";
import Vote from "../models/vote.model.js";
import Player from "../models/player.model.js";
import { toObjectId } from "../utils/helpers.js";

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

// Calculate results for a question in a session, returning vote counts and updating scores
export const calculateResults = async (
    sessionId: string,
    questionId: string
) => {

    const votes = await Vote.find({
        sessionId,
        questionId,
    })
        .populate("playerId", "name")
        .populate("votedForId", "name")
        .lean();

    const voteCounts: Record<string, number> = {};
    const detailedVotes = [];

    for (const vote of votes) {
        const votedFor = vote.votedForId as any;
        const voter = vote.playerId as any;

        if (votedFor && votedFor._id) {
            const idStr = votedFor._id.toString();
            voteCounts[idStr] = (voteCounts[idStr] || 0) + 1;
        }

        detailedVotes.push({
            playerName: voter.name,
            votedForName: votedFor ? votedFor.name : "Unknown",
        });
    }

    // Update scores for each voted player
    for (const [playerIdStr, count] of Object.entries(voteCounts)) {
        await Player.findByIdAndUpdate(playerIdStr, {
            $inc: { score: count },
        });
    }

    // Get updated leaderboard
    const players = await Player.find({ sessionId }).sort({ score: -1 }).lean();

    const leaderboard = players.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        score: p.score,
    }));

    return {
        votes: detailedVotes,
        leaderboard,
        voteCounts, // Optional: if frontend needs raw counts
    };
};