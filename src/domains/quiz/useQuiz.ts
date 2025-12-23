"use client";

import { useState } from "react";
import {
    createQuiz,
    fetchQuizzes,
    fetchQuiz,
    updateQuiz,
    deleteQuiz,
} from "@/domains/quiz/quiz.service";

import {
    QuizCreateRequest,
    QuizCreateResponse,
    QuizDetailResponse,
    Quiz,
    QuizUpdateRequest,
    QuizUpdateResponse,
} from "@/domains/quiz/quiz.types";

import { useAsync } from "@/hooks/useAsync";

export function useQuiz() {
    const { loading, run } = useAsync();

    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [currentQuiz, setCurrentQuiz] =
        useState<QuizDetailResponse | null>(null);

    // CREATE
    const create = (data: QuizCreateRequest): Promise<QuizCreateResponse> =>
        run(async () => {
            const created = await createQuiz(data);

            // optimistic list update
            setQuizzes((prev) => [
                ...prev,
                {
                    id: created.id,
                    title: created.title,
                    visibility: "private",
                    createdAt: created.createdAt,
                    questionsCount: created.questionsCount,
                },
            ]);

            return created;
        });

    // LIST
    const fetchAll = (): Promise<Quiz[]> =>
        run(async () => {
            const list = await fetchQuizzes();
            setQuizzes(list);
            return list;
        });

    // DETAIL
    const fetchById = (quizId: string): Promise<QuizDetailResponse> =>
        run(async () => {
            const quiz = await fetchQuiz(quizId);
            setCurrentQuiz(quiz);
            return quiz;
        });

    // UPDATE
    const updateById = (
        quizId: string,
        data: QuizUpdateRequest
    ): Promise<QuizUpdateResponse> =>
        run(async () => {
            const updated = await updateQuiz(quizId, data);

            setQuizzes((prev) =>
                prev.map((q) =>
                    q.id === quizId ? { ...q, title: updated.title } : q
                )
            );

            setCurrentQuiz((prev) =>
                prev && prev.id === quizId
                    ? { ...prev, ...updated }
                    : prev
            );

            return updated;
        });

    // DELETE
    const removeById = (quizId: string) =>
        run(async () => {
            await deleteQuiz(quizId);

            setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
            setCurrentQuiz((prev) =>
                prev?.id === quizId ? null : prev
            );
        });

    return {
        // state
        quizzes,
        currentQuiz,
        loading,

        // actions
        createQuiz: create,
        fetchQuizzes: fetchAll,
        fetchQuiz: fetchById,
        updateQuiz: updateById,
        deleteQuiz: removeById,
    };
}
