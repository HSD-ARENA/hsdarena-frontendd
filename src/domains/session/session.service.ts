import { apiFetch } from "@/lib/api";
import { SessionCreateRequest, SessionCreateResponse, SessionDetailResponse, SessionStartResponse, SessionTeamsResponse, SessionQuisForTeamsResponse } from "@/domains/session/session.types";
import { ScoreboardResponse } from "@/domains/session/scoreboard.types";
import { AnswerRequest, AnswerResponse } from "@/domains/session/answer.types";
import { CurrentQuestionResponse } from "@/domains/questions/question.types";

export const createSession = (quizId: string, payload: SessionCreateRequest): Promise<SessionCreateResponse> =>
    apiFetch(`/admin/quizzes/${quizId}/session`, { method: "POST", body: JSON.stringify(payload) });

export const fetchSession = (sessionCode: string): Promise<SessionDetailResponse> =>
    apiFetch(`/admin/sessions/${sessionCode}`);

export const fetchScoreboard = (sessionCode: string): Promise<ScoreboardResponse> =>
    apiFetch(`/admin/sessions/${sessionCode}/scoreboard`);

export const startSession = (sessionCode: string): Promise<SessionStartResponse> =>
    apiFetch(`/admin/sessions/${sessionCode}/start`, { method: "POST" });

export const fetchSessionQuiz = (sessionCode: string): Promise<SessionQuisForTeamsResponse> =>
    apiFetch(`/sessions/${sessionCode}/quiz`);

export const fetchCurrentQuestion = (sessionCode: string): Promise<CurrentQuestionResponse> =>
    apiFetch(`/sessions/${sessionCode}/question/current`);

export const submitAnswer = (sessionCode: string, payload: AnswerRequest): Promise<AnswerResponse> =>
    apiFetch(`/sessions/${sessionCode}/answer`, {
        method: "POST", headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("teamToken")}`,
        }, body: JSON.stringify(payload)
    });

export const fetchTeams = (sessionCode: string): Promise<SessionTeamsResponse> =>
    apiFetch(`/sessions/${sessionCode}/teams`);


