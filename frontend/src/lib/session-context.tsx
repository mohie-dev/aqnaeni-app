import { createContext, useContext, useState, type ReactNode } from "react";
import type {
  Player,
  Question,
  ResultsData,
  Session,
  Topic,
} from "./types";
import * as api from "./api";

interface SessionContextValue {
  session: Session | null;
  players: Player[];
  currentQuestion: Question | null;
  results: ResultsData | null;
  stances: Record<string, string>;
  votes: Record<string, string>;
  loading: boolean;
  error: string | null;
  createSession: (topic: Topic) => Promise<Session>;
  addPlayer: (name: string) => Promise<Player>;
  refreshSession: (code: string) => Promise<void>;
  deletePlayer: (playerId: string) => Promise<void>;
  fetchQuestion: () => Promise<Question>;
  decideQuestion: (decision: "approve" | "reject") => Promise<{ status: string }>;
  submitStance: (playerId: string, value: string) => Promise<void>;
  loadStances: () => Promise<Array<{ playerId: string; playerName: string; value: string }>>;
  submitVote: (playerId: string, votedForId: string) => Promise<void>;
  loadResults: () => Promise<ResultsData>;
  resetFlow: () => void;
  setError: (message: string | null) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [results, setResults] = useState<ResultsData | null>(null);
  const [stances, setStances] = useState<Record<string, string>>({});
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = async (topic: Topic) => {
    setLoading(true);
    setError(null);
    try {
      const created = await api.createSession(topic);
      setSession(created);
      setPlayers([]);
      setCurrentQuestion(null);
      setResults(null);
      setStances({});
      setVotes({});
      return created;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addPlayer = async (name: string) => {
    if (!session) {
      throw new Error("Session is not initialized.");
    }

    setLoading(true);
    setError(null);
    try {
      const result = await api.joinSession(session.code, name);
      setPlayers((current) => [...current, result.player]);
      return result.player;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSessionByCode(code);
      setSession(data);
      setPlayers(data.players ?? []);
      return;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePlayer = async (playerId: string) => {
    if (!session) {
      throw new Error("Session is not initialized.");
    }

    setLoading(true);
    setError(null);
    try {
      await api.deletePlayer(session._id, playerId);
      setPlayers((current) => current.filter((player) => player._id !== playerId));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestion = async () => {
    if (!session) {
      throw new Error("Session is not initialized.");
    }

    setLoading(true);
    setError(null);
    try {
      const question = await api.getNextQuestion(session._id);
      setCurrentQuestion(question);
      setResults(null);
      setStances({});
      setVotes({});
      return question;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const decideQuestion = async (decision: "approve" | "reject") => {
    if (!session) {
      throw new Error("Session is not initialized.");
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.hostDecision(session._id, decision);
      if (decision === "reject") {
        setCurrentQuestion(null);
      }
      return response;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitStance = async (playerId: string, value: string) => {
    if (!session || !currentQuestion) {
      throw new Error("Missing current session or question.");
    }

    setLoading(true);
    setError(null);
    try {
      await api.submitStance(session._id, currentQuestion._id, playerId, value);
      setStances((current) => ({ ...current, [playerId]: value }));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadStances = async () => {
    if (!session || !currentQuestion) {
      throw new Error("Missing current session or question.");
    }

    setLoading(true);
    setError(null);
    try {
      const nextStances = await api.getStances(session._id, currentQuestion._id);
      const stanceMap: Record<string, string> = {};
      nextStances.forEach((s) => {
        stanceMap[s.playerId] = s.value;
      });
      setStances(stanceMap);
      return nextStances;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitVote = async (playerId: string, votedForId: string) => {
    if (!session || !currentQuestion) {
      throw new Error("Missing current session or question.");
    }

    setLoading(true);
    setError(null);
    try {
      await api.submitVote(session._id, currentQuestion._id, playerId, votedForId);
      setVotes((current) => ({ ...current, [playerId]: votedForId }));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadResults = async () => {
    if (!session || !currentQuestion) {
      throw new Error("Missing current session or question.");
    }

    setLoading(true);
    setError(null);
    try {
      const nextResults = await api.getResults(session._id, currentQuestion._id);
      setResults(nextResults);
      return nextResults;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setSession(null);
    setPlayers([]);
    setCurrentQuestion(null);
    setResults(null);
    setStances({});
    setVotes({});
    setLoading(false);
    setError(null);
  };

  const value: SessionContextValue = {
    session,
    players,
    currentQuestion,
    results,
    stances,
    votes,
    loading,
    error,
    createSession,
    addPlayer,
    refreshSession,
    deletePlayer,
    fetchQuestion,
    decideQuestion,
    submitStance,
    loadStances,
    submitVote,
    loadResults,
    resetFlow,
    setError,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
