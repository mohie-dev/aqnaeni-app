import type {
  DefenderData,
  Player,
  Question,
  QuestionFormData,
  ResultsData,
  Session,
  Topic,
  VoteValue,
} from "./types";

const API_BASE = "https://aqnaeni-app.onrender.com/api";

const handleResponse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  
  if (!text) {
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    return undefined as T;
  }

  let payload: any;
  try {
    payload = JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
  }

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || `Server error: ${response.status}`);
  }

  // If payload has a 'data' field, use it; otherwise remove metadata fields
  if (payload.data !== undefined) {
    return payload.data as T;
  }
  
  // Remove success/message fields and return remaining data
  const { success, message, ...data } = payload;
  return data as T;
};

export const createSession = async (topic: Topic) => {
  const response = await fetch(`${API_BASE}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });

  return handleResponse<Session>(response);
};

export const joinSession = async (code: string, name: string) => {
  const response = await fetch(`${API_BASE}/sessions/${code}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  return handleResponse<{ player: Player }>(response);
};

export const getSessionByCode = async (code: string) => {
  const response = await fetch(`${API_BASE}/sessions/${code}`);
  return handleResponse<Session>(response);
};

export const getNextQuestion = async (sessionId: string) => {
  const response = await fetch(`${API_BASE}/sessions/${sessionId}/question`);
  return handleResponse<Question>(response);
};

export const hostDecision = async (sessionId: string, decision: "approve" | "reject") => {
  const response = await fetch(`${API_BASE}/sessions/${sessionId}/question/decision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ decision: decision === "approve" ? "approved" : "rejected" }),
  });
  return handleResponse<{ status: string }>(response);
};

export const submitVote = async (
  sessionId: string,
  questionId: string,
  playerId: string,
  value: VoteValue
) => {
  const response = await fetch(`${API_BASE}/votes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, questionId, playerId, value }),
  });

  return handleResponse(response);
};

export const getResults = async (sessionId: string, questionId: string) => {
  const response = await fetch(`${API_BASE}/votes/results/${sessionId}/${questionId}`);
  return handleResponse<ResultsData>(response);
};

export const getDefender = async (sessionId: string, questionId: string) => {
  const response = await fetch(`${API_BASE}/votes/defender/${sessionId}/${questionId}`);
  return handleResponse<DefenderData>(response);
};

export const getQuestions = async () => {
  const response = await fetch(`${API_BASE}/questions`);
  return handleResponse<Question[]>(response);
};

export const createQuestion = async (question: QuestionFormData) => {
  const response = await fetch(`${API_BASE}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(question),
  });
  return handleResponse<Question>(response);
};

export const updateQuestion = async (id: string, question: QuestionFormData) => {
  const response = await fetch(`${API_BASE}/questions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(question),
  });
  return handleResponse<Question>(response);
};

export const deleteQuestion = async (id: string) => {
  const response = await fetch(`${API_BASE}/questions/${id}`, {
    method: "DELETE",
  });
  return handleResponse<{ message: string }>(response);
};
