export type Topic =
  | "random"
  | "debate"
  | "trendy"
  | "deep"
  | "relationships"
  | "gym";

export type QuestionStatus = "idle" | "pending" | "approved" | "rejected";

export type StanceValue = "agree" | "disagree";

export interface Player {
  _id: string;
  name: string;
  score: number;
}

export interface Session {
  _id: string;
  code: string;
  topic: Topic;
  questionStatus: QuestionStatus;
  roundNumber: number;
  currentQuestion?: string | null;
  players?: Player[];
}

export interface Question {
  _id: string;
  content: string;
  topic: Topic;
  mood?: string;
}

export interface ResultsData {
  leaderboard: { id: string; name: string; score: number }[];
  votes: Array<{ playerName: string; votedForName: string }>;
  voteCounts: Record<string, number>;
}

export interface QuestionFormData {
  content: string;
  topic: Topic;
  mood?: string;
}
