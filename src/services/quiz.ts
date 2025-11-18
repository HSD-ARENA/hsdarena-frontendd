import { apiFetch } from "@/lib/api";
import { QuizCreateRequest, QuizCreateResponse, QuizDetail, SessionCreateResponse } from "@/types/quiz";

export const createQuiz = async (data: QuizCreateRequest): Promise<QuizCreateResponse> =>
    apiFetch("/quiz/create", { method: "POST", body: JSON.stringify(data) });

export const getQuiz = async (id: string): Promise<QuizDetail> =>
    apiFetch(`/quiz/${id}`, { method: "GET" });

export const getTeamQuiz = async (id: string): Promise<QuizDetail> =>
    apiFetch(`/quiz/session/${id}/questions`, { method: "GET" });

export const getSession = async (id: string): Promise<SessionCreateResponse> =>
    apiFetch(`/quiz/${id}/session`, { method: "POST" });