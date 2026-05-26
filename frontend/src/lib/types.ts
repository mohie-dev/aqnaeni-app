export type Topic =
  | "random"
  | "debate"
  | "trendy"
  | "deep"
  | "relationships"
  | "gym";

export type VoteValue = "agree" | "disagree";

export type QuestionStatus = "idle" | "pending" | "approved" | "rejected";

export interface Player {
  _id: string;
  name: string;
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
  agree: number;
  disagree: number;
  votes: Array<{ playerName: string; vote: VoteValue }>;
}

export interface DefenderData {
  player: string;
  originalVote: VoteValue;
  mustDefend: VoteValue;
}

export interface QuestionFormData {
  content: string;
  topic: Topic;
  mood?: string;
}
