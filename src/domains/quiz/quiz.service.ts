import { apiFetch } from "@/lib/api";
import { QuizCreateRequest, QuizCreateResponse, QuizUpdateRequest, QuizUpdateResponse, QuizDetailResponse, Quiz } from "@/domains/quiz/quiz.types";

export const createQuiz = async (data: QuizCreateRequest): Promise<QuizCreateResponse> =>
    apiFetch("/admin/quizzes", { method: "POST", body: JSON.stringify(data) });

export const fetchQuizzes = async (): Promise<Quiz[]> =>
    apiFetch("/admin/quizzes");

export const fetchQuiz = async (quizId: string): Promise<QuizDetailResponse> =>
    apiFetch(`/admin/quizzes/${quizId}`);

export const updateQuiz = async (quizId: string, data: QuizUpdateRequest): Promise<QuizUpdateResponse> =>
    apiFetch(`/admin/quizzes/${quizId}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteQuiz = async (quizId: string) =>
    apiFetch(`/admin/quizzes/${quizId}`, { method: "DELETE" });