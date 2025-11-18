import { useState } from "react";
import { createQuiz, getQuiz, getSession, getTeamQuiz } from "@/services/quiz";
import { QuizCreateRequest, QuizCreateResponse, QuizDetail, SessionCreateResponse } from "@/types/quiz";

export function useQuiz() {
    const [currentQuiz, setCurrentQuiz] = useState<QuizDetail | null>(null);
    const [loading, setLoading] = useState(false);

    const create = async (data: QuizCreateRequest): Promise<QuizCreateResponse> => {
        setLoading(true);
        const res = await createQuiz(data);
        setLoading(false);
        return res;
    };

    const fetch = async (id: string): Promise<QuizDetail | null> => {
        setLoading(true);
        const res = await getQuiz(id);
        setCurrentQuiz(res);
        setLoading(false);
        return res;
    };

    const fetchQuestions = async (id: string): Promise<QuizDetail | null> => {
        setLoading(true);
        const res = await getTeamQuiz(id);
        setCurrentQuiz(res);
        setLoading(false);
        return res;
    };

    const fectSession = async (id: string): Promise<SessionCreateResponse | null> => {
        setLoading(true);
        const res = await getSession(id);
        setLoading(false);
        return res;
    }

    return { create, fetch, fectSession, fetchQuestions, currentQuiz, loading };
}
