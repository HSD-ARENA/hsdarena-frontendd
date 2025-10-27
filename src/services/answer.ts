import { apiFetch } from "@/lib/api";
import { AnswerRequest, AnswerResponse } from "@/types/answer";

export const submitAnswer = async (data: AnswerRequest): Promise<AnswerResponse> =>
    apiFetch("/answer", { method: "POST", body: JSON.stringify(data) });
