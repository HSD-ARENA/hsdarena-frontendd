import { apiFetch } from "@/lib/api";
import { QuestionDetail, QuizCreateQuestion, QuizAddQuestionRequest, QuizAddQuestionResponse, QuizUpdateQuestionRequest, QuizUpdateQuestionResponse } from "@/domains/questions/question.types";

export const addQuestionToQuiz = async (quizId: string, data: QuizAddQuestionRequest): Promise<QuizAddQuestionResponse> =>
    apiFetch(`/admin/quizzes/${quizId}/questions`, { method: "POST", body: JSON.stringify(data) });

export const fetchQuizQuestions = async (quizId: string): Promise<QuestionDetail[]> =>
    apiFetch(`/admin/quizzes/${quizId}/questions`);

export const updateQuestion = async (questionId: string, data: QuizUpdateQuestionRequest): Promise<QuizUpdateQuestionResponse> =>
    apiFetch(`/admin/questions/${questionId}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteQuestion = async (questionId: string) =>
    apiFetch(`/admin/questions/${questionId}`, { method: "DELETE" });