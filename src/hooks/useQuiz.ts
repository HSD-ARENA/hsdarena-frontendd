import { useState } from "react";
import { createQuiz, getQuiz } from "@/services/quiz";
import { QuizCreateRequest, QuizCreateResponse, QuizDetail } from "@/types/quiz";

export function useQuiz() {
    const [currentQuiz, setCurrentQuiz] = useState<QuizDetail | null>(null);
    const [loading, setLoading] = useState(false);

    const create = async (data: QuizCreateRequest): Promise<QuizCreateResponse> => {
        setLoading(true);
        const res = await createQuiz(data);
        setLoading(false);
        return res;
    };

    const fetch = async (id: string) => {
        setLoading(true);
        const res = await getQuiz(id);
        setCurrentQuiz(res);
        setLoading(false);
    };

    return { create, fetch, currentQuiz, loading };
}
