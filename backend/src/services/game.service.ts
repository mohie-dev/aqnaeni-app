import Session from "../models/session.model.js";
import Question from "../models/question.model.js";
import Vote from "../models/vote.model.js";
import { toObjectId } from "../utils/helpers.js";
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

// Calculate results for a question in a session, returning counts of agree/disagree and individual votes
export const calculateResults = async (
    sessionId: string,
    questionId: string
) => {

    const votes = await Vote.find({
        sessionId,
        questionId,
    })
        .populate("playerId", "name")
        .lean();

    let agree = 0;
    let disagree = 0;

    for (const vote of votes) {
        if (vote.value === PlayerDecision.AGREE) {
            agree++;
        } else {
            disagree++;
        }
    }

    return {
        agree,
        disagree,
        votes: votes.map((vote: any) => ({
            playerName: vote.playerId.name,
            vote: vote.value,
        })),
    };
};

// Pick a random player from the votes who voted opposite to the majority 
// and assign them as the defender for the next round
export const pickOppositeDefender = (
    votes: any[]
) => {

    if (!votes.length) {
        return null;
    }

    const randomIndex = Math.floor(
        Math.random() * votes.length
    );

    const selectedVote = votes[randomIndex];

    const mustDefend =
        selectedVote.value === PlayerDecision.AGREE
            ? PlayerDecision.DISAGREE
            : PlayerDecision.AGREE;

    return {
        player: selectedVote.playerId.name,

        originalVote: selectedVote.value,

        mustDefend,
    };
};