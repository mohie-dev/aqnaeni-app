export enum SessionStatus {
  ACTIVE = "active",
  FINISHED = "finished"
}

export enum Topic {
    DEBATE = "debate",
    FUNNY = "funny",
    DEEP = "deep",
    RELATIONSHIPS = "relationships",
    GYM = "gym",
    RANDOM = "random"
}

export enum Mood {
    LIGHT = "light",
    MEDIUM = "medium",
    DEEP = "deep",
    TOXIC = "toxic"
}

export enum PlayerDecision {
    AGREE = "agree",
    DISAGREE = "disagree",
}

export enum  QuestionStatus {
    IDLE = "idle",
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}

export interface Vote {
    playerId: string;
    value: PlayerDecision;
}