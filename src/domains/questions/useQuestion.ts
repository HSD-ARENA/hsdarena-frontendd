"use client";

import { useState } from "react";
import {
    addQuestionToQuiz,
    fetchQuizQuestions,
    updateQuestion,
    deleteQuestion,
} from "@/domains/questions/question.service";

import {
    QuestionDetail,
    QuizAddQuestionRequest,
    QuizUpdateQuestionRequest,
} from "@/domains/questions/question.types";

import { useAsync } from "@/hooks/useAsync";

export function useQuestion() {
    const { loading, run } = useAsync();
    const [questions, setQuestions] = useState<QuestionDetail[]>([]);

    // LIST
    const fetchByQuizId = (quizId: string): Promise<QuestionDetail[]> =>
        run(async () => {
            const list = await fetchQuizQuestions(quizId);
            setQuestions(list);
            return list;
        });

    // CREATE
    const addToQuiz = (
        quizId: string,
        data: QuizAddQuestionRequest
    ): Promise<QuestionDetail> =>
        run(async () => {
            const created = await addQuestionToQuiz(quizId, data);
            setQuestions((prev) => [...prev, created]);
            return created;
        });

    // UPDATE
    const updateById = (
        questionId: string,
        data: QuizUpdateQuestionRequest
    ): Promise<QuestionDetail> =>
        run(async () => {
            const updated = await updateQuestion(questionId, data);
            setQuestions((prev) =>
                prev.map((q) => (q.id === questionId ? updated : q))
            );
            return updated;
        });

    // DELETE
    const removeById = (questionId: string): Promise<void> =>
        run(async () => {
            await deleteQuestion(questionId);
            setQuestions((prev) =>
                prev.filter((q) => q.id !== questionId)
            );
        });

    return {
        // state
        questions,
        loading,

        // actions
        fetchQuestions: fetchByQuizId,
        addQuestion: addToQuiz,
        updateQuestion: updateById,
        deleteQuestion: removeById,
    };
}
