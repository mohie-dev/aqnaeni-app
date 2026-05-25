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
    NEUTRAL = "neutral"
}

export interface Vote {
    playerId: string;
    value: PlayerDecision;
}