import { PlayerDecision } from "../utils/enum.js";

export type PopulatedVote = {
  playerId: {
    _id: string;
    name: string;
  };

  value: PlayerDecision;
};