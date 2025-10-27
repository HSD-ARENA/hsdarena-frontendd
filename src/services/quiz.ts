import { apiFetch } from "@/lib/api";
import { QuizCreateRequest, QuizCreateResponse, QuizDetail } from "@/types/quiz";

export const createQuiz = async (data: QuizCreateRequest): Promise<QuizCreateResponse> =>
    apiFetch("/quiz/create", { method: "POST", body: JSON.stringify(data) });

export const getQuiz = async (id: string): Promise<QuizDetail> =>
    apiFetch(`/quiz/${id}`);
